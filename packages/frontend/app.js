const baseUrl = 'http://localhost:3000/ts-learn'

// utils
function $(selector) {
  return document.querySelector(selector);
}
function monthFormmater(str) {
  return str.substring(0, 4) + '-' + str.substring(4)
}
function chartBorderColor (arr) {
  if (!arr.length) return null
  return {
    A01: '#f7a543',
    B02: '#7fcd91',
  }[arr[0].code] || '#fff'
}
// DOM
const selectedMonth = $('.selected-month');
const leadingIndex = $('.leading');
const coincidentIndex = $('.coincident');
const momthList = $('.month-list');
const leadingTitle = $('.leadingTitle')
const coincidentTitle = $('.coincidentTitle')
const leadingList = $('.leading-list');
const coincidentList = $('.coincident-list');
const leadingSpinner = createSpinnerElement('leading-spinner');
const coincidentSpinner = createSpinnerElement('coincident-spinner');

function createSpinnerElement(id) {
  const wrapperDiv = document.createElement('div');
  wrapperDiv.setAttribute('id', id);
  wrapperDiv.setAttribute(
    'class',
    'spinner-wrapper flex justify-center align-center',
  );
  const spinnerDiv = document.createElement('div');
  spinnerDiv.setAttribute('class', 'ripple-spinner');
  spinnerDiv.appendChild(document.createElement('div'));
  spinnerDiv.appendChild(document.createElement('div'));
  wrapperDiv.appendChild(spinnerDiv);
  return wrapperDiv;
}

// state
let isLeadingLoading = false;
let isCoincidentLoading = false;

// api
function fetchMonths() {
  const url = `${baseUrl}/months`
  return axios.get(url)
}

function fetchIndexCompositionInfo(indexName, month) {
  const url = `${baseUrl}/months/${month}/indexes/${indexName}/compositions`
  return axios.get(url)
}

function fetchLatestIndicatorsByCode(code) {
  const url = `${baseUrl}/latest/indicators/${code}`
  return axios.get(url)
}

// methods
function startApp() {
  setupData();
  initEvents();
}

// events
function initEvents() {
  momthList.addEventListener('click', handleMonthListClick);
  leadingList.addEventListener('click', handleIndicatorListClick)
  coincidentList.addEventListener('click', handleIndicatorListClick)
}

async function handleIndicatorListClick(event) {
  let selectedId;
  let selectedMainId;
  if (
    event.target instanceof HTMLParagraphElement ||
    event.target instanceof HTMLSpanElement
  ) {
    selectedId = event.target.parentElement.id;
    selectedMainId = event.target.parentElement.getAttribute('data-main-code');
  }
  if (event.target instanceof HTMLLIElement) {
    selectedId = event.target.id;
    selectedMainId = event.target.getAttribute('data-main-code');
  }
  if (isLeadingLoading) {
    return;
  }
  if (!selectedId || !selectedMainId) {
    return;
  }
  isLeadingLoading = true;
  const { data: selectedData } = await fetchLatestIndicatorsByCode(selectedId)
  setChartData([selectedData], false)
  isLeadingLoading = false;
}

async function handleMonthListClick(event) {
  let selectedId;
  if (
    event.target instanceof HTMLParagraphElement ||
    event.target instanceof HTMLSpanElement
  ) {
    selectedId = event.target.parentElement.id;
  }
  if (event.target instanceof HTMLLIElement) {
    selectedId = event.target.id;
  }
  if (isLeadingLoading) {
    return;
  }
  clearLeadingList();
  clearCoincidentList();
  startLoadingAnimation();
  isLeadingLoading = true;
  setSelectMonth([selectedId])
  const { data: leadingIndexInfo } = await fetchIndexCompositionInfo('leading', selectedId)
  const { data: coincidentIndexInfo } = await fetchIndexCompositionInfo('coincident', selectedId)
  setLeadingIndexByMain(leadingIndexInfo)
  setCoincidentIndexByMain(coincidentIndexInfo)
  endLoadingAnimation()
  setLeadingComposition(leadingIndexInfo)
  setCoincidentComposition(coincidentIndexInfo)
  isLeadingLoading = false;
  removeChart()
}

function setLeadingComposition (data) {
  const mainCode = data.find(v => v.isMainIndex).code;
  data.forEach(value => {
    if (value.isMainIndex) return;
    const li = document.createElement('li');
    li.setAttribute('class', 'list-item-b flex align-center justify-space-between');
    li.setAttribute('id', value.code);
    li.setAttribute('data-main-code', mainCode)
    const p = document.createElement('p');
    p.textContent = value.codeName
    const span = document.createElement('span');
    span.textContent = value.value;
    span.setAttribute('class', 'leading');
    li.appendChild(p);
    li.appendChild(span);
    leadingList.appendChild(li);
  });
}

function clearLeadingList() {
  leadingList.innerHTML = null;
}

function setCoincidentComposition (data) {
  const mainCode = data.find(v => v.isMainIndex).code;
  data.forEach(value => {
    if (value.isMainIndex) return
    const li = document.createElement('li');
    li.setAttribute('class', 'list-item-b flex align-center justify-space-between');
    li.setAttribute('id', value.code);
    li.setAttribute('data-main-code', mainCode);
    const p = document.createElement('p');
    p.textContent = value.codeName
    const span = document.createElement('span');
    span.textContent = value.value;
    span.setAttribute('class', 'coincident');
    li.appendChild(p);
    li.appendChild(span);
    coincidentList.appendChild(li);
  });
}

function clearCoincidentList() {
  coincidentList.innerHTML = null
}

function startLoadingAnimation() {
  leadingList.appendChild(leadingSpinner);
  coincidentList.appendChild(coincidentSpinner);
}

function endLoadingAnimation() {
  leadingList.removeChild(leadingSpinner);
  coincidentList.removeChild(coincidentSpinner);
}

async function setupData() {
  const { data: months } = await fetchMonths();
  setMonthList(months);
  setSelectMonth(months);
  const { data: leadingIndexInfo } = await fetchIndexCompositionInfo('leading', months[0])
  const { data: coincidentIndexInfo } = await fetchIndexCompositionInfo('coincident', months[0])
  setLeadingIndexByMain(leadingIndexInfo)
  setCoincidentIndexByMain(coincidentIndexInfo)
  setLeadingComposition(leadingIndexInfo)
  setCoincidentComposition(coincidentIndexInfo)
  const leadingIndexCode = leadingIndexInfo.find(v => v.isMainIndex).code
  const coincidentIndexCode = coincidentIndexInfo.find(v => v.isMainIndex).code
  const { data: leadingLatest } = await fetchLatestIndicatorsByCode(leadingIndexCode)
  const { data: coincidentLatest } = await fetchLatestIndicatorsByCode(coincidentIndexCode)
  setChartData([leadingLatest, coincidentLatest], true)
}
const lineChart = (function () {
  let instance;
  function setInstance () {
    const ctx = $('#lineChart').getContext('2d');
    Chart.defaults.color = '#f5eaea';
    Chart.defaults.font.family = 'Exo 2';
    return new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [],
      },
      options: {
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
          },
          y1: {
            type: 'linear',
            display: false,
            position: 'right',
            grid: {
              drawOnChartArea: false
            },
          }
        }
      },
    });
  }
  return {
    getInstance () {
      if (!instance) {
        instance = setInstance();
      }
      return instance;
    }
  }
})()
function removeChart () {
  const chart = lineChart.getInstance()
  if (chart.data.datasets.length > 2) {
    chart.data.datasets.pop();
    chart.options.scales.y1.display = false
    chart.update();
  }
}
function renderChart(chartDataArray, labels) {
  const chart = lineChart.getInstance()
  chart.data.labels = labels
  chartDataArray.forEach(function (dataset) {
    chart.data.datasets.push(dataset)
  })
  if (chart.data.datasets.length > 2) {
    chart.data.datasets.pop();
  }
  chart.options.scales.y1.display = false
  chart.update();
}
function updateChart(chartData) {
  const chart = lineChart.getInstance();
  if (chart.data.datasets.length > 2) {
    chart.data.datasets.pop() ;
  }
  chart.data.datasets.push(chartData);
  chart.options.scales.y1.display = true;
  chart.update();
}

function setChartData([arr1, arr2], isMain) {
  const chartLabel = arr1
    .slice()
    .map(value => new Date(value.month.slice(0, 4), value.month.slice(4) - 1).toLocaleString().slice(0, 8))
  const yAxisID = isMain ? 'y' : 'y1';
  const chartData = {
    label: arr1[0].codeName,
    data: arr1.slice().map(v => +v.value),
    borderColor: chartBorderColor(arr1),
    yAxisID
  }
  if (isMain) {
    renderChart([
      chartData,
      {
        label: arr2[1].codeName,
        data: arr2.slice().map(v => +v.value),
        borderColor: chartBorderColor(arr2),
        yAxisID
      }
    ], chartLabel)
  } else {
    updateChart(chartData);
  }
  
}

function setLeadingTitle (data) {
  leadingTitle.innerHTML = data;
}

function setCoincidentTitle (data) {
  coincidentTitle.innerHtml = data;
}

function setLeadingIndexByMain(data) {
  leadingIndex.innerHTML = data.find(v => v.isMainIndex).value
}

function setCoincidentIndexByMain(data) {
  coincidentIndex.innerHTML = data.find(v => v.isMainIndex).value
}

function setSelectMonth(data) {
  selectedMonth.innerHTML = monthFormmater(data[0])
  selectedMonth.setAttribute('id', data[0])
}

function setMonthList(data) {
  const latestMonths = data.slice(0, 24)
  latestMonths.forEach(value => {
    const li = document.createElement('li');
    li.setAttribute('class', 'list-item align-center');
    li.setAttribute('id', value);
    const span = document.createElement('span');
    span.textContent = monthFormmater(value);
    li.appendChild(span);
    momthList.appendChild(li);
  });
}

startApp();