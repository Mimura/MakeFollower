package controllers

import (
	"encoding/json"
	"io/ioutil"
	"makeFollower/app/models"
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

	i := 0
	cursorParam := ""
	const CountParamName = "count"
	const CountParam = "5000"
	const StringifyParamName = "stringify_ids"
	const StringifyParam = "true"
	const CursorParamName = "cursor"

	cursorInt := 1
	for cursorInt >= 1 && i < 15 {
		sendParam := map[string]string{CountParamName: CountParam, StringifyParamName: StringifyParam, CursorParamName: cursorParam}
		//初回だけcorsor(ページ指定みたいなもの)は送らない
		if i <= 0 {
			sendParam = map[string]string{CountParamName: CountParam, StringifyParamName: StringifyParam}
		}

		resp, err := sendGetTwitter(uRLFriendsIDs, sendParam, user)
		if err != nil {
			return c.Render()
		}
		defer resp.Body.Close()

		tmpList := decodeFollowIDs(resp)

		followIDList.IDs = append(followIDList.IDs, tmpList.IDs...)
		cursorParam = tmpList.NextCursorStr
		cursorInt, err = strconv.Atoi(cursorParam)
		if err != nil {
			cursorInt = 0
		}

		i++
	}

	return c.Render(followIDList)
}

// GetSearch 検索する
func (c App) GetSearch(status string, searchWord string, page int) revel.Result {
	user := getUserFromSession(c)
	if user.AccessToken == nil {
		return c.Redirect(App.Index)
	}

	result := []userData{}
	count := 0
	//20以上になるか100回まで回す
	for len(result) < 20 && count < 100 {

		param := map[string]string{"q": searchWord, "f": "users", "src": "typd", "count": "20", "page": strconv.Itoa(page)}
		resp, err := sendGetTwitter(uRLUsersSearch, param, user)
		if err != nil {
			return c.Render()
		}
		defer resp.Body.Close()

		tmpResult := decodeSearchUser(resp)

		for _, value := range tmpResult {
			if value.UserID == "1" {

			}
		}

		result = append(result, tmpResult...)
		count++
		page++
	}

	sendResult := sendData{UserDataArray: result, NextPage: page}

	revel.INFO.Println(sendResult)

	return c.RenderJson(sendResult)
}

func sendGetTwitter(url string, param map[string]string, user *models.User) (*http.Response, error) {
	resp, err := TWITTER.Get(
		url,
		param,
		user.AccessToken)
	if err != nil {
		revel.ERROR.Println(err)
	}

	return resp, err
}

func decodeSearchUser(response *http.Response) []userData {
	result := []userData{}

	err := json.NewDecoder(response.Body).Decode(&result)
	if err != nil {
		revel.ERROR.Println(err)
	}

	return result
}

func decodeFollowIDs(response *http.Response) followList {
	result := followList{}

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

var followIDList = followList{}

const uRLUsersSearch = "https://api.twitter.com/1.1/users/search.json"
const uRLFriendsIDs = "https://api.twitter.com/1.1/friends/ids.json"

type sendData struct {
	UserDataArray []userData `json:"userDataArray"`
	NextPage      int        `json:"nextPage"`
}

type userData struct {
	Description string `json:"description"`
	ID          int    `json:"id"`
	Name        string `json:"name"`
	UserID      string `json:"screen_name"`
	IconURL     string `json:"profile_image_url_https"`
}

type followList struct {
	IDs           []string `json:"ids"`
	NextCursorStr string   `json:"next_cursor_str"`
}

type statuses struct {
	Statuses []statusData `json:"statuses"`
}
type statusData struct {
	Text string `json:"text"`
}
