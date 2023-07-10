const selectZone = document.querySelector('.selector');
const zoneTitle = document.querySelector('.district_title');
const mainList = document.querySelector('.travel_spots');
const hotSpots = document.querySelectorAll('.hot_district li');
const goTop = document.querySelector('.btn_goTop');

// fetch API function
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('API Error:' + response.status);
    }
    const data = await response.json();
    return data.result.records;
  } catch (error) {
    console.error('something wrong', error);
  }
}

// 旅遊列表 HTML 模板

function travelContentTemplate(name, zone, picture, openTime, address, tel, ticketInfo) {
  return `
  <div class="travel_content">
  <div class="spot_img" style="background-image: url('${picture}')">
    <p class="img_title">${name}</p>
    <p class="img_zone_title">${zone}</p>
  </div>
  <div class="spot_detail">
    <p><img src="assets/icons_clock.png" alt="">${openTime}</p>
    <p><img src="assets/icons_pin.png" alt="">${address}</p>
    
    <p><img src="assets/icons_phone.png" alt="">${tel}</p>
    <p class="ticket_info"><img src="assets/icons_tag.png" alt="">${ticketInfo}</p>
  </div>
</div>`
}


// 獲取 API 資料
const responseData = fetchData('https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json');

// 設定下拉式選單內容
async function setZoneOptions() {
  try {
    const data = await responseData;

    // 地區列表物件
    const zoneList = {};

    // 整理出不重複地區清單
    data.forEach(item => {
      const zone = item.Zone;
      zoneList[zone] = true;
    });
    console.log(zoneList);

    // 將地區新增至下拉清單
    Object.keys(zoneList).forEach(zone => {
      const optionElement = document.createElement('option');
      optionElement.value = zone;
      optionElement.textContent = zone;
      selectZone.appendChild(optionElement);
    });



  } catch (error) {
    console.error('something wrong', error);
  }
}
setZoneOptions();



// 監聽下拉式選單選擇
selectZone.addEventListener('change', e => {
  let htmlStr = '';

  // 更改 h2 標題
  zoneTitle.innerHTML = e.target.value;
  responseData.then(res => {
    const filteredData = res.filter(item => item.Zone === e.target.value);
    // console.log(filteredData);
    filteredData.forEach(spot => {
      htmlStr += travelContentTemplate(spot.Name, spot.Zone, spot.Picture1, spot.Opentime, spot.Add, spot.Tel, spot.Ticketinfo);
    });
    mainList.innerHTML = htmlStr;
  })

});

// 熱門行政區選擇
hotSpots.forEach(selected => {
  let htmlStr = '';

  selected.addEventListener('click', () => {
    responseData.then(res => {
      const filteredData = res.filter(item => item.Zone === selected.textContent);
      filteredData.forEach(spot => {
        htmlStr += travelContentTemplate(spot.Name, spot.Zone, spot.Picture1, spot.Opentime, spot.Add, spot.Tel, spot.Ticketinfo);
      });
      mainList.innerHTML = htmlStr;
    })
  })
});

// 捲動視窗時顯示回頂部按鈕行為
window.addEventListener("scroll", () => {
  if(this.scrollY > 0){
    goTop.setAttribute('style', 'opacity: 100; cursor: pointer;');
  }else {
    goTop.setAttribute('style', 'opacity: 0;');
  }
});

// 點擊回頂部按鈕
goTop.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

console.log("peehua");
