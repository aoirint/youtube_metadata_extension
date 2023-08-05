(function() {
  // https://qiita.com/h53/items/05139982c6fd81212b08
  function toISOStringWithTimezone(date) {
    const pad = function (str) {
        return ('0' + str).slice(-2);
    };
    const year = (date.getFullYear()).toString();
    const month = pad((date.getMonth() + 1).toString());
    const day = pad(date.getDate().toString());
    const hour = pad(date.getHours().toString());
    const min = pad(date.getMinutes().toString());
    const sec = pad(date.getSeconds().toString());
    const tz = -date.getTimezoneOffset();
    const sign = tz >= 0 ? '+' : '-';
    const tzHour = pad((tz / 60).toString());
    const tzMin = pad((tz % 60).toString());

    return `${year}-${month}-${day}T${hour}:${min}:${sec}${sign}${tzHour}:${tzMin}`;
  }

  const menuElement = document.createElement("div");
  menuElement.style.backgroundColor = "#FFFFFFCC";
  menuElement.style.padding = "4px 16px";
  menuElement.style.fontSize = "12pt";
  menuElement.style.display = "flex";
  menuElement.style.flexDirection = "column";
  menuElement.style.position = "fixed";
  menuElement.style.left = "0px";
  menuElement.style.bottom = "0px";

  let intervalVideoJsonLdId = null;
  let intervalChannelId = null;

  const channelIdElement = document.createElement("div");
  const videoIdElement = document.createElement("div");
  const uploadDateElement = document.createElement("div");
  const startTimeElement = document.createElement("div");
  const endTimeElement = document.createElement("div");

  channelIdElement.innerText = "チャンネルID"
  videoIdElement.innerText = "動画ID"
  uploadDateElement.innerText = "アップロード日"
  startTimeElement.innerText = "開始時間"
  endTimeElement.innerText = "終了時間"

  const channelIdInputElement = document.createElement("input");
  const videoIdInputElement = document.createElement("input");
  const uploadDateInputElement = document.createElement("input");
  const startTimeInputElement = document.createElement("input");
  const endTimeInputElement = document.createElement("input");

  menuElement.appendChild(channelIdElement);
  menuElement.appendChild(channelIdInputElement);
  menuElement.appendChild(videoIdElement);
  menuElement.appendChild(videoIdInputElement);
  menuElement.appendChild(uploadDateElement);
  menuElement.appendChild(uploadDateInputElement);
  menuElement.appendChild(startTimeElement);
  menuElement.appendChild(startTimeInputElement);
  menuElement.appendChild(endTimeElement);
  menuElement.appendChild(endTimeInputElement);
  document.body.appendChild(menuElement);

  function getVideoId() {
    const currentUrl = new URL(location.href);

    const paramVideoId = currentUrl.searchParams.get("v");
    if (paramVideoId != null) {
      return paramVideoId;
    }

    const urlPath = currentUrl.pathname;
    const liveUrlMatch = urlPath.match(/^\/live\/(.+)$/);
    if (liveUrlMatch != null) {
      return liveUrlMatch[1];
    }

    return null;
  }

  function getChannelId() {
    const infoCardChannelAnchorElement = document.querySelector("#infocard-channel-button > ytd-button-renderer > yt-button-shape > a");
    if (infoCardChannelAnchorElement != null) {
      const channelAboutUrlString = infoCardChannelAnchorElement.getAttribute("href");
      const channelAboutUrl = new URL(channelAboutUrlString, location.href);
      const channelAboutUrlMatch = channelAboutUrl.pathname.match(/^\/channel\/(.+)\/about$/);

      if (channelAboutUrlMatch != null) {
        return channelAboutUrlMatch[1];
      }
    }

    return null;
  }

  function doIntervalChannelId() {
    const channelId = getChannelId();
    if (channelId != null) {
      channelIdInputElement.value = channelId;

      // stop interval if loaded
      clearInterval(intervalChannelId);
    }
  }

  function doIntervalVideoJsonLd() {
    const videoJsonLdElement = document.querySelector("#scriptTag");
    if (videoJsonLdElement == null) return;

    const videoJsonLd = JSON.parse(videoJsonLdElement.innerText);

    const uploadDateString = videoJsonLd.uploadDate;

    const publication = videoJsonLd.publication;
    if (publication != null) {
      const publicationItem = publication[0];

      const startTimeString = publicationItem.startDate;
      const endTimeString = publicationItem.endDate;
  
      uploadDateInputElement.value = uploadDateString;
      startTimeInputElement.value = startTimeString;
      endTimeInputElement.value = endTimeString;
    }

    // stop interval if loaded
    clearInterval(intervalVideoJsonLdId);
  }

  const videoId = getVideoId();
  videoIdInputElement.value = videoId != null ? videoId : null;

  intervalChannelId = setInterval(doIntervalChannelId, 100);
  intervalVideoJsonLdId = setInterval(doIntervalVideoJsonLd, 100);
})();
