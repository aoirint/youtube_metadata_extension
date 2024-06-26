import { format } from 'date-fns-tz'

console.log('YouTube Metadata Extension Loading')

const displayTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

const menuElement = document.createElement('div')
menuElement.style.backgroundColor = '#FFFFFFCC'
menuElement.style.padding = '4px 16px'
menuElement.style.fontSize = '12pt'
menuElement.style.display = 'flex'
menuElement.style.flexDirection = 'column'
menuElement.style.zIndex = '999'
menuElement.style.position = 'fixed'
menuElement.style.left = '0px'
menuElement.style.bottom = '0px'

let intervalVideoObjectId: number | null = null
let intervalChannelId: number | null = null

const channelIdElement = document.createElement('div')
const videoIdElement = document.createElement('div')
const uploadDateElement = document.createElement('div')
const startTimeElement = document.createElement('div')
const endTimeElement = document.createElement('div')

channelIdElement.innerText = 'チャンネルID'
videoIdElement.innerText = '動画ID'
uploadDateElement.innerText = 'アップロード日'
startTimeElement.innerText = '開始時間'
endTimeElement.innerText = '終了時間'

const channelIdInputElement = document.createElement('input')
const videoIdInputElement = document.createElement('input')
const uploadDateInputElement = document.createElement('input')
const startTimeInputElement = document.createElement('input')
const endTimeInputElement = document.createElement('input')

function clickToSelectAllHandler(event: MouseEvent) {
  if (!(event.target instanceof HTMLInputElement)) {
    throw Error('Unexpected event target type')
  }

  event.target.select()
}

channelIdInputElement.addEventListener('click', clickToSelectAllHandler)
videoIdInputElement.addEventListener('click', clickToSelectAllHandler)
uploadDateInputElement.addEventListener('click', clickToSelectAllHandler)
startTimeInputElement.addEventListener('click', clickToSelectAllHandler)
endTimeInputElement.addEventListener('click', clickToSelectAllHandler)

menuElement.appendChild(channelIdElement)
menuElement.appendChild(channelIdInputElement)
menuElement.appendChild(videoIdElement)
menuElement.appendChild(videoIdInputElement)
menuElement.appendChild(uploadDateElement)
menuElement.appendChild(uploadDateInputElement)
menuElement.appendChild(startTimeElement)
menuElement.appendChild(startTimeInputElement)
menuElement.appendChild(endTimeElement)
menuElement.appendChild(endTimeInputElement)
document.body.appendChild(menuElement)

function getVideoId() {
  const currentUrl = new URL(location.href)

  const paramVideoId = currentUrl.searchParams.get('v')
  if (paramVideoId != null) {
    return paramVideoId
  }

  const urlPath = currentUrl.pathname
  const liveUrlMatch = urlPath.match(/^\/live\/(.+)$/)
  if (liveUrlMatch != null) {
    return liveUrlMatch[1]
  }

  return null
}

function getChannelId() {
  const infoCardChannelAnchorElement = document.querySelector(
    '#infocard-channel-button > ytd-button-renderer > yt-button-shape > a',
  )
  if (infoCardChannelAnchorElement != null) {
    const channelAboutUrlString = infoCardChannelAnchorElement.getAttribute('href')
    const channelAboutUrl = new URL(channelAboutUrlString, location.href)
    const channelAboutUrlMatch = channelAboutUrl.pathname.match(/^\/channel\/(.+)\/about$/)

    if (channelAboutUrlMatch != null) {
      return channelAboutUrlMatch[1]
    }
  }

  return null
}

function doIntervalChannelId() {
  const channelId = getChannelId()
  if (channelId != null) {
    channelIdInputElement.value = channelId

    // stop interval if loaded
    clearInterval(intervalChannelId)
  }
}

function doIntervalVideoObject() {
  const videoObjectElement = document.querySelector('#watch7-content')
  if (videoObjectElement == null) return

  const uploadDateElement: HTMLMetaElement | null = videoObjectElement.querySelector(
    'meta[itemprop="uploadDate"]',
  )
  const uploadDateString = uploadDateElement != null ? uploadDateElement.content : null
  uploadDateInputElement.value =
    uploadDateString != null
      ? format(new Date(uploadDateString), "yyyy-MM-dd'T'HH:mm:ssxxx", {
          timeZone: displayTimezone,
        })
      : ''

  const publicationElement = videoObjectElement.querySelector('span[itemprop="publication"]')
  if (publicationElement != null) {
    const startDateElement: HTMLMetaElement | null = publicationElement.querySelector(
      'meta[itemprop="startDate"]',
    )
    const startDateString = startDateElement != null ? startDateElement.content : null
    const endDateElement: HTMLMetaElement | null = publicationElement.querySelector(
      'meta[itemprop="endDate"]',
    )
    const endDateString = endDateElement != null ? endDateElement.content : null

    startTimeInputElement.value =
      startDateString != null
        ? format(new Date(startDateString), "yyyy-MM-dd'T'HH:mm:ssxxx", {
            timeZone: displayTimezone,
          })
        : ''
    endTimeInputElement.value =
      endDateString != null
        ? format(new Date(endDateString), "yyyy-MM-dd'T'HH:mm:ssxxx", {
            timeZone: displayTimezone,
          })
        : ''
  }

  // stop interval if loaded
  clearInterval(intervalVideoObjectId)
}

const videoId = getVideoId()
videoIdInputElement.value = videoId != null ? videoId : null

intervalChannelId = setInterval(doIntervalChannelId, 100)
intervalVideoObjectId = setInterval(doIntervalVideoObject, 100)
