package controllers

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strconv"

	"github.com/revel/revel"
)

// SearchList 検索リスト表示
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
		Text string `json:"text"`
	}{}
	err = json.NewDecoder(resp.Body).Decode(&mentions)
	if err != nil {
		revel.ERROR.Println(err)
	}
	revel.INFO.Println(mentions)

	return c.Render(mentions)
}

// GetSearch 検索する
func (c App) GetSearch(status string, searchWord string, page int) revel.Result {
	user := getUserFromSession(c)
	if user.AccessToken == nil {
		return c.Redirect(App.Index)
	}
	// We have a token, so look for mentions.
	resp, err := TWITTER.Get(
		"https://api.twitter.com/1.1/users/search.json",
		map[string]string{"q": searchWord, "f": "users", "src": "typd", "count": "20", "page": strconv.Itoa(page)},
		user.AccessToken)
	if err != nil {
		revel.ERROR.Println(err)
		return c.Render()
	}
	defer resp.Body.Close()

	result := decodeSearchUser(resp)
	// result := decodeToInterface(resp)

	return c.RenderJson(result)
}

func decodeSearchUser(response *http.Response) []userData {
	result := []userData{}

	err := json.NewDecoder(response.Body).Decode(&result)
	if err != nil {
		revel.ERROR.Println(err)
	}

	return result
}

func decodeSearchTweet(response *http.Response) statuses {
	result := statuses{}

	err := json.NewDecoder(response.Body).Decode(&result)
	if err != nil {
		revel.ERROR.Println(err)
	}

	return result
}

func decodeToInterface(response *http.Response) interface{} {
	b, _ := ioutil.ReadAll(response.Body)

	// decode
	var result interface{}
	_ = json.Unmarshal(b, &result)

	revel.INFO.Println(result)
	// revel.INFO.Println("%#v", result)

	return result
}

type userData struct {
	Description string `json:"description"`
	ID          int    `json:"id"`
	Name        string `json:"name"`
	UserID      string `json:"screen_name"`
	IconURL     string `json:"profile_image_url_https"`
}

type statuses struct {
	Statuses []statusData `json:"statuses"`
}
type statusData struct {
	Text string `json:"text"`
}
