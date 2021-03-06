import { getAccessToken, getGroupId } from "@/database"
import axios from "axios"
import moment from "moment"


export const fetchArticles = async function(dateRange) {
  const accessToken = await getAccessToken()
  const groupId = await getGroupId()
  const url = `https://graph.facebook.com/v10.0/${groupId}/feed`
  const dateRangeInUnix = dateRange.map((timestamp) => {
    return moment(timestamp).unix()
  })
  return axios.get(url, {
    params: {
      access_token: accessToken,
      since: dateRangeInUnix[0],
      until: dateRangeInUnix[1],
      limit: 100,
      fields: "message,description,created_time,comments{message}",
    },
  })
}

