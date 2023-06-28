const baseUrl = 'http://localhost:3000/ts-learn'

// utils
function $(selector) {
  return document.querySelector(selector);
}
function monthFormmater(str) {
  return str.substring(0, 4) + '-' + str.substring(4)
}
function getUnixTimestamp(date) {
  return new Date(date).getTime();
}

// DOM
const selectedMonth = $('.selected-month');
const leadingIndex = $('.leading');
const coincidentIndex = $('.coincident');
const momthList = $('.month-list');
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
}

async function handleIndicatorListClick(event) {
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
  isLeadingLoading = true;
  const { data } = await fetchLatestIndicatorsByCode(selectedId)
  console.log(data)

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
  // setChartData(confirmedResponse);
  isLeadingLoading = false;
}

function setLeadingComposition(data) {

  data.forEach(value => {
    if (value.isMainIndex) return
    const li = document.createElement('li');
    li.setAttribute('class', 'list-item-b flex align-center justify-space-between');
    li.setAttribute('id', value.code)
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

function setTotalDeathsByCountry(data) {
  deathsTotal.innerText = data[0].Cases;
}

function setCoincidentComposition(data) {

  data.forEach(value => {
    const li = document.createElement('li');
    li.setAttribute('class', 'list-item-b flex align-center justify-space-between');
    li.setAttribute('id', value.code);
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

}

function renderChart(data, labels) {
  var ctx = $('#lineChart').getContext('2d');
  Chart.defaults.color = '#f5eaea';
  Chart.defaults.font.family = 'Exo 2';
  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Confirmed for the last two weeks',
          backgroundColor: '#feb72b',
          borderColor: '#feb72b',
          data,
        },
      ],
    },
    options: {},
  });
}

function setChartData(data) {
  const chartData = data.slice(-14).map(value => value.Cases);
  const chartLabel = data
    .slice(-14)
    .map(value => new Date(value.Date).toLocaleDateString().slice(5, -1));
  renderChart(chartData, chartLabel);
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

function setMonthList(months) {
  months.forEach((value, index) => {
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