const selectZone = document.querySelector('.selector');
const zoneTitle = document.querySelector('.district_title');
const mainList = document.querySelector('.travel_spots');
const hotSpots = document.querySelectorAll('.hot_district li');

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
  // 更改標題
  zoneTitle.innerHTML = e.target.value;
  responseData .then(res => {
    const filteredData = res.filter(item => item.Zone === e.target.value);
    console.log(filteredData);
  })

});

// hotSpots.forEach(spot => {
//   spot.addEventListener('click', () => {
//     console.log(spot.textContent);
//   })
// })


console.log("peehua");
