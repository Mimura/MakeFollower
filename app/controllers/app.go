package controllers

import (
	"encoding/json"
	"io/ioutil"
	"makeFollower/app/models"

	"github.com/mrjones/oauth"
	"github.com/revel/revel"
)

var TWITTER = oauth.NewConsumer(
	"VgRjky4dTA1U2Ck16MmZw",
	"l8lOLyIF3peCFEvrEoTc8h4oFwieAFgPM6eeTRo30I",
	oauth.ServiceProvider{
		AuthorizeTokenUrl: "https://api.twitter.com/oauth/authorize",
		RequestTokenUrl:   "https://api.twitter.com/oauth/request_token",
		AccessTokenUrl:    "https://api.twitter.com/oauth/access_token",
	},
)

type App struct {
	*revel.Controller
}

// func (c App) Index() revel.Result {
// 	return c.Render()
// }

func (c App) Index() revel.Result {
	user := getUserFromSession(c)
	if user.AccessToken == nil {
		return c.Render()
	}
	return c.Redirect(App.SearchList)
}

func (c App) SearchList() revel.Result {
	user := getUserFromSession(c)
	if user.AccessToken == nil {
		return c.Redirect(App.Index)
	}
	// We have a token, so look for mentions.
	resp, err := TWITTER.Get(
		"https://api.twitter.com/1.1/statuses/mentions_timeline.json",
		map[string]string{"count": "10"},
		user.AccessToken)
	if err != nil {
		revel.ERROR.Println(err)
		return c.Render()
	}
	defer resp.Body.Close()

	// Extract the mention text.
	mentions := []struct {
		Text string `json:text`
	}{}
	err = json.NewDecoder(resp.Body).Decode(&mentions)
	if err != nil {
		revel.ERROR.Println(err)
	}
	revel.INFO.Println(mentions)

	return c.Render(mentions)
}

func (c App) GetSearch(status string) revel.Result {
	user := getUserFromSession(c)
	if user.AccessToken == nil {
		return c.Redirect(App.Index)
	}
	// We have a token, so look for mentions.
	resp, err := TWITTER.Get(
		"https://api.twitter.com/1.1/search/tweets.json",
		map[string]string{"q": "おやすみ"},
		user.AccessToken)
	if err != nil {
		revel.ERROR.Println(err)
		return c.Render()
	}
	defer resp.Body.Close()

	b, err := ioutil.ReadAll(resp.Body)

	// decode
	var result interface{}
	err = json.Unmarshal(b, &result)

	revel.INFO.Println(result)

	return c.RenderJson(result)
}

type SearchResult struct {
	statuses Statuses `json:statuses`
}
type Statuses struct {
	Text []string `json:text`
}

func (c App) SetStatus(status string) revel.Result {
	resp, err := TWITTER.PostForm(
		"http://api.twitter.com/1.1/statuses/update.json",
		map[string]string{"status": status},
		createUser().AccessToken,
	)
	if err != nil {
		revel.ERROR.Println(err)
		return c.RenderError(err)
	}
	defer resp.Body.Close()
	bodyBytes, _ := ioutil.ReadAll(resp.Body)
	revel.INFO.Println(string(bodyBytes))
	c.Response.ContentType = "app/json"
	return c.RenderText(string(bodyBytes))
}

// Twitter authentication

func (c App) Authenticate(oauth_verifier string) revel.Result {
	user := createUser()

	requestToken, url, err := TWITTER.GetRequestTokenAndUrl("http://127.0.0.1:9002/App/AuthenticateBack")

	if err != nil {
		revel.ERROR.Println("Error connecting to twitter:", err)
		return c.Redirect(App.Index)
	}

	revel.INFO.Println("一個目のAuthのgetrequestToken")
	// We received the unauthorized tokens in the OAuth object - store it before we proceed
	user.RequestToken = requestToken
	saveUser(c, user)
	return c.Redirect(url)
}

func (c App) AuthenticateBack(oauth_verifier string) revel.Result {
	user := getUserFromSession(c)

	revel.INFO.Println("2個目のAuthの最初")
	// We got the verifier; now get the access token, store it and back to index
	accessToken, err := TWITTER.AuthorizeToken(user.RequestToken, oauth_verifier)

	if err != nil {
		revel.ERROR.Println("Error connecting to twitter:", err)
		return c.Redirect(App.Index)
	}

	revel.INFO.Println("2個目のAuthのaccessToken")
	user.AccessToken = accessToken

	saveUser(c, user)

	return c.Redirect(App.SearchList)
}

func createUser() *models.User {
	return models.FindOrCreate("guest")
}

func getUserFromSession(c App) *models.User {
	userName := "guest1"
	userData := &models.User{Username: userName}
	userData.RequestToken = &oauth.RequestToken{Token: "", Secret: ""}
	userData.AccessToken = &oauth.AccessToken{Token: "", Secret: ""}
	userData.RequestToken.Token = c.Session[userName+"_request_token"]
	userData.RequestToken.Secret = c.Session[userName+"_request_secret"]
	revel.INFO.Println(userData.RequestToken)
	userData.AccessToken.Token = c.Session[userName+"_access_token"]
	userData.AccessToken.Secret = c.Session[userName+"_access_secret"]
	revel.INFO.Println(userData.AccessToken)
	if userData.AccessToken.Token == "" {
		userData.AccessToken = nil
	}
	return userData
}

func saveUser(c App, user *models.User) {
	userName := "guest1"

	//セーブするものがない
	if user.RequestToken == nil {
		return
	}

	c.Session[userName+"_request_token"] = user.RequestToken.Token
	c.Session[userName+"_request_secret"] = user.RequestToken.Secret
	revel.INFO.Println("リクエストトークンを保存")

	//リクエストトークンだけだった
	if user.AccessToken == nil {
		return
	}

	c.Session[userName+"_access_token"] = user.AccessToken.Token
	c.Session[userName+"_access_secret"] = user.AccessToken.Secret
	revel.INFO.Println("アクセストークンを保存")
}

func init() {
	TWITTER.Debug(true)
}
