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

	revel.INFO.Println(followIDMap)

	err := updateFollowList(user)
	if err != nil {
		return c.Render()
	}

	return c.Render()
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

		tmpResult, err := decodeSearchUser(resp)
		if err != nil {
			return c.Render()
		}

		for i, value := range tmpResult {
			_, ok := followIDMap[strconv.Itoa(value.ID)]
			tmpResult[i].IsFollowed = ok
		}

		result = append(result, tmpResult...)
		count++
		page++
	}

	sendResult := sendData{UserDataArray: result, NextPage: page}

	revel.INFO.Println(sendResult)

	return c.RenderJson(sendResult)
}

func (c App) SendFollow(userId string) revel.Result {
	user := getUserFromSession(c)
	if user.AccessToken == nil {
		return c.Redirect(App.Index)
	}

	param := map[string]string{"user_id": userId}
	resp, err := sendPostTwitter(uRLFriehdShipsCreate, param, user)
	if err != nil {
		return c.Render()
	}
	defer resp.Body.Close()

	updateFollowListNoRequest(userId)

	return c.RenderJson(resp.Body)
}

func (c App) SendUnFollow(userId string) revel.Result {
	user := getUserFromSession(c)
	if user.AccessToken == nil {
		return c.Redirect(App.Index)
	}

	param := map[string]string{"user_id": userId}
	resp, err := sendPostTwitter(uRLFriehdShipsDestroy, param, user)
	if err != nil {
		return c.Render()
	}
	defer resp.Body.Close()

	updateFollowListNoRequest(userId)

	return c.RenderJson(resp.Body)
}

func sendPostTwitter(url string, param map[string]string, user *models.User) (*http.Response, error) {
	resp, err := TWITTER.Post(
		url,
		param,
		user.AccessToken)
	if err != nil {
		revel.ERROR.Println(err)
	}

	return resp, err
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

func updateFollowList(user *models.User) error {
	cursorParam := ""
	const CountParamName = "count"
	const CountParam = "5000"
	const StringifyParamName = "stringify_ids"
	const StringifyParam = "true"
	const CursorParamName = "cursor"
	i := 0
	cursorInt := 1
	receiveData := followList{}
	followIDMap = make(map[string]int)
	for cursorInt >= 1 && i < 15 {
		sendParam := map[string]string{CountParamName: CountParam, StringifyParamName: StringifyParam, CursorParamName: cursorParam}
		//初回だけcorsor(ページ指定みたいなもの)は送らない
		if i <= 0 {
			sendParam = map[string]string{CountParamName: CountParam, StringifyParamName: StringifyParam}
		}

		resp, err := sendGetTwitter(uRLFriendsIDs, sendParam, user)
		if err != nil {
			return err
		}
		defer resp.Body.Close()

		tmpList, err := decodeFollowIDs(resp)
		if err != nil {
			return err
		}

		receiveData.IDs = append(receiveData.IDs, tmpList.IDs...)
		cursorParam = tmpList.NextCursorStr
		cursorInt, err = strconv.Atoi(cursorParam)
		if err != nil {
			cursorInt = 0
			return err
		}

		i++
	}

	for _, id := range receiveData.IDs {
		followIDMap[id] = 1
	}

	return nil
}

func updateFollowListNoRequest(id string) {
	followIDMap[id] = 1
}

func decodeSearchUser(response *http.Response) ([]userData, error) {
	result := []userData{}

	err := json.NewDecoder(response.Body).Decode(&result)
	if err != nil {
		revel.ERROR.Println(err)
	}

	return result, err
}

func decodeFollowIDs(response *http.Response) (followList, error) {
	result := followList{}

	err := json.NewDecoder(response.Body).Decode(&result)
	if err != nil {
		revel.ERROR.Println(err)
	}

	return result, err
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

var followIDMap = map[string]int{}

const uRLUsersSearch = "https://api.twitter.com/1.1/users/search.json"
const uRLFriendsIDs = "https://api.twitter.com/1.1/friends/ids.json"
const uRLFriehdShipsCreate = "https://api.twitter.com/1.1/friendships/create.json"
const uRLMyAccountInfo = "https://api.twitter.com/1.1/account/settings.json"
const uRLFriehdShipsDestroy = "https://api.twitter.com/1.1/friendships/destroy.json"

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
	IsFollowed  bool   `json:"is_followed"`
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
