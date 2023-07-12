const selectZone = document.querySelector('.selector');
const zoneTitle = document.querySelector('.district_title');
const mainList = document.querySelector('.travel_spots');
const hotSpots = document.querySelectorAll('.hot_district li');
const goTop = document.querySelector('.btn_goTop');
const selectPagination = document.querySelector('.pagination');


// fetch API function
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('API Error:' + response.status);
    }
    const data = await response.json();
    const jsonData = data.result.records;
    return jsonData;
  } catch (error) {
    console.error('something wrong', error);
  }
}

// 旅遊列表 HTML 模板
// spot.Name, spot.Zone, spot.Picture1, spot.Opentime, spot.Add, spot.Tel, spot.Ticketinfo
function travelContentTemplate(spot) {
  return `
  <div class="travel_content">
  <div class="spot_img" style="background-image: url('${spot.Picture1}')">
    <p class="img_title">${spot.Name}</p>
    <p class="img_zone_title">${spot.Zone}</p>
  </div>
  <div class="spot_detail">
    <p><img src="assets/icons_clock.png" alt="">${spot.Opentime}</p>
    <p><img src="assets/icons_pin.png" alt="">${spot.Add}</p>
    
    <p><img src="assets/icons_phone.png" alt="">${spot.Tel}</p>
    <p class="ticket_info"><img src="assets/icons_tag.png" alt="">${spot.Ticketinfo}</p>
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
    // console.log(zoneList);

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

  // 更改 h2 標題
  zoneTitle.innerHTML = e.target.value;
  responseData.then(res => {
    const filteredData = res.filter(item => item.Zone === e.target.value);
    // console.log(filteredData);
    setPagination(filteredData, 1);
    // filteredData.forEach(spot => {
    //   htmlStr += travelContentTemplate(spot);
    // });
    // mainList.innerHTML = htmlStr;
  })

});

// 熱門行政區選擇
hotSpots.forEach(selected => {
  selected.addEventListener('click', e => {
    zoneTitle.innerHTML = e.target.textContent;
    //更改下拉式選單內容
    selectZone.value = e.target.textContent;
    responseData.then(res => {
      const filteredData = res.filter(item => item.Zone === selected.textContent);
      // filteredData.forEach(spot => {
      //   htmlStr += travelContentTemplate(spot);
      // });
      // mainList.innerHTML = htmlStr;
      setPagination(filteredData, 1);
    })

  })
});

// 捲動視窗時顯示回頂部按鈕行為
window.addEventListener('DOMContentLoaded', () => {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 0) {
      goTop.setAttribute('style', 'display: block');
    } else {
      goTop.setAttribute('style', 'display: none');
    }
  });
});


// 點擊回頂部按鈕
goTop.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

// 分頁顯示
function setPagination(fetchData, currentPage) {

  //取得總資料筆數
  const dataTotal = fetchData.length;

  // 取得資料地區
  // 若沒有資料地區則將頁面清空
  let currentZone = "";
  if (dataTotal === 0) {
    mainList.innerHTML = "";
    selectPagination.innerHTML = "";
  } else {
    currentZone = fetchData[0].Zone;
  }

  // 設定每頁顯示資料筆數
  const contentPerPage = 6;

  // 計算所需頁數
  const pageTotal = Math.ceil(dataTotal / contentPerPage);

  console.log(`Total: ${dataTotal} 總頁數: ${pageTotal}`);

  // 頁面資料顯示範圍
  const minData = (currentPage * contentPerPage) - contentPerPage + 1;
  const maxData = (currentPage * contentPerPage);

  const data = [];

  // 過濾顯示範圍資料
  fetchData.forEach((item, index) => {
    if (index + 1 >= minData && index + 1 <= maxData) {
      data.push(item);
    }
  })

  // 建立 page 資料物件傳送給分頁產生用
  const pageObj = {
    dataTotal,
    currentPage,
    pageTotal,
    currentZone,
    hasPage: currentPage > 1,
    hasNext: currentPage < pageTotal
  }

  // 產生頁面HTML
  let htmlStr = '';
  data.forEach(spot => {
    htmlStr += travelContentTemplate(spot);
  });
  mainList.innerHTML = htmlStr;

  paginationBtn(pageObj);
}

// 分頁按鈕產生
function paginationBtn(page) {
  let btnStr = '';

  // 前一頁按鈕
  if (page.hasPage) {
    btnStr += `<p class="prev" value="${Number(page.currentPage) - 1}" data-zone="${page.currentZone}">< prev</p>`;
  } else {
    btnStr += `<p class="prev" value="0" style="color: gray; cursor: default">< prev</p>`;
  }

  // 頁數按鈕
  for (let btnNum = 1; btnNum <= page.pageTotal; btnNum++) {
    if (btnNum === page.currentPage) {
      btnStr += `<p value="0" style="color: #559AC8; cursor: default"">${btnNum}</p>`;
    } else {
      btnStr += `<p value="${btnNum}" data-zone="${page.currentZone}">${btnNum}</p>`;
    }

  }

  // 下一頁按鈕
  if (page.hasNext) {
    btnStr += `<p class="next" value="${Number(page.currentPage) + 1}" data-zone="${page.currentZone}">next ></p>`;
  } else {
    btnStr += `<p class="next" value="0" style="color: gray; cursor: default">next ></p>`;
  }


  selectPagination.innerHTML = btnStr;
}

// 監聽點選分頁按鈕
function switchPage(e) {
  const clickedNum = Number(e.target.getAttribute('value'));

  if (clickedNum === 0) {
    return true;
  }

  responseData.then(res => {
    const filteredData = res.filter(item => item.Zone === e.target.dataset.zone);
    setPagination(filteredData, clickedNum);
    window.scrollTo({
      top: 300,
      behavior: "smooth"
    });
  })

}

selectPagination.addEventListener('click', switchPage);

