import { getAccessToken, getGroupId } from "@/database"
import axios from "axios"
import moment from "moment"


export const fetchArticles = async function(dateRange) {
  const accessToken = await getAccessToken()
  const groupId = await getGroupId()
  const url = `https://graph.facebook.com/v8.0/${groupId}/feed`
  const dateRangeInUnix = dateRange.map((timestamp) => {
    return moment(timestamp).unix()
  })
  return axios.get(url, {
    params: {
      access_token: accessToken,
      since: dateRangeInUnix[0],
      until: dateRangeInUnix[1],
      limit: 500,
      fields: "message,created_time,comments{message}",
    },
  })
}

