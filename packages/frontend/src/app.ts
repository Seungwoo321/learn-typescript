import axios from 'axios';
import { Chart, registerables } from 'chart.js';
const baseUrl =
  'https://ez3qceako9.execute-api.ap-northeast-2.amazonaws.com/v1/ts-learn';

// utils
function $(selector: string) {
  return document.querySelector(selector);
}
function monthFormmater(str: string) {
  return str.substring(0, 4) + '-' + str.substring(4);
}
interface CodeColor {
  [code: string]: string;
}
function chartBorderColor(arr: any): string {
  if (!arr.length) return null;
  const colors: CodeColor = {
    A01: '#f7a543',
    B02: '#7fcd91',
  };
  return colors[arr[0].code] || '#fff';
}
// DOM
const selectedMonth = $('.selected-month');
const leadingIndex = $('.leading') as HTMLParagraphElement;
const coincidentIndex = $('.coincident') as HTMLParagraphElement;
const momthList = $('.month-list');
const leadingList = $('.leading-list');
const coincidentList = $('.coincident-list');
const leadingSpinner = createSpinnerElement('leading-spinner');
const coincidentSpinner = createSpinnerElement('coincident-spinner');

function createSpinnerElement(id: string) {
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
let isLoading = false;

// api
function fetchMonths() {
  const url = `${baseUrl}/months`;
  return axios.get(url);
}

enum IndexType {
  Leading = 'leading',
  Coincident = 'coincident',
}

function fetchIndexCompositionInfo(indexName: IndexType, month: string) {
  const url = `${baseUrl}/months/${month}/indexes/${indexName}/compositions`;
  return axios.get(url);
}

function fetchLatestIndicatorsByCode(code: string) {
  const url = `${baseUrl}/indicators/${code}/latest`;
  return axios.get(url);
}

// methods
function startApp() {
  setupData();
  initEvents();
}

// events
function initEvents() {
  momthList.addEventListener('click', handleMonthListClick);
  leadingList.addEventListener('click', handleIndicatorListClick);
  coincidentList.addEventListener('click', handleIndicatorListClick);
}

async function handleIndicatorListClick(event: MouseEvent) {
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
  if (isLoading) {
    return;
  }
  if (!selectedId || !selectedMainId) {
    return;
  }
  isLoading = true;
  const { data: selectedData } = await fetchLatestIndicatorsByCode(selectedId);
  setChartData(selectedData);
  isLoading = false;
}

async function handleMonthListClick(event: MouseEvent) {
  let selectedMonth;
  if (
    event.target instanceof HTMLParagraphElement ||
    event.target instanceof HTMLSpanElement
  ) {
    selectedMonth = event.target.parentElement.id;
  }
  if (event.target instanceof HTMLLIElement) {
    selectedMonth = event.target.id;
  }
  if (isLoading) {
    return;
  }
  clearLeadingList();
  clearCoincidentList();
  startLoadingAnimation();
  isLoading = true;
  setSelectMonth([selectedMonth]);
  const { data: leadingIndexInfo } = await fetchIndexCompositionInfo(
    IndexType.Leading,
    selectedMonth,
  );
  const { data: coincidentIndexInfo } = await fetchIndexCompositionInfo(
    IndexType.Coincident,
    selectedMonth,
  );
  setLeadingIndexByMain(leadingIndexInfo);
  setCoincidentIndexByMain(coincidentIndexInfo);
  endLoadingAnimation();
  setLeadingComposition(leadingIndexInfo);
  setCoincidentComposition(coincidentIndexInfo);
  isLoading = false;
  renderChart();
}

function setLeadingComposition(data: any) {
  const mainCode = data.find((v: any) => v.isMainIndex).code;
  data.forEach((value: any) => {
    if (value.isMainIndex) return;
    const li = document.createElement('li');
    li.setAttribute(
      'class',
      'list-item-b flex align-center justify-space-between',
    );
    li.setAttribute('id', value.code);
    li.setAttribute('data-main-code', mainCode);
    const p = document.createElement('p');
    p.textContent = value.codeName;
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

function setCoincidentComposition(data: any) {
  const mainCode = data.find((v: any) => v.isMainIndex).code;
  data.forEach((value: any) => {
    if (value.isMainIndex) return;
    const li = document.createElement('li');
    li.setAttribute(
      'class',
      'list-item-b flex align-center justify-space-between',
    );
    li.setAttribute('id', value.code);
    li.setAttribute('data-main-code', mainCode);
    const p = document.createElement('p');
    p.textContent = value.codeName;
    const span = document.createElement('span');
    span.textContent = value.value;
    span.setAttribute('class', 'coincident');
    li.appendChild(p);
    li.appendChild(span);
    coincidentList.appendChild(li);
  });
}

function clearCoincidentList() {
  coincidentList.innerHTML = null;
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
  const { data: leadingIndexInfo } = await fetchIndexCompositionInfo(
    IndexType.Leading,
    months[0],
  );
  const { data: coincidentIndexInfo } = await fetchIndexCompositionInfo(
    IndexType.Coincident,
    months[0],
  );
  setLeadingIndexByMain(leadingIndexInfo);
  setCoincidentIndexByMain(coincidentIndexInfo);
  setLeadingComposition(leadingIndexInfo);
  setCoincidentComposition(coincidentIndexInfo);
  const leadingIndexCode = leadingIndexInfo.find(
    (v: any) => v.isMainIndex,
  ).code;
  const coincidentIndexCode = coincidentIndexInfo.find(
    (v: any) => v.isMainIndex,
  ).code;
  const { data: leadingLatest } = await fetchLatestIndicatorsByCode(
    leadingIndexCode,
  );
  const { data: coincidentLatest } = await fetchLatestIndicatorsByCode(
    coincidentIndexCode,
  );
  setChartData(leadingLatest, coincidentLatest);
}
const lineChart = (function () {
  let instance: any;
  function setInstance() {
    const ctx = $('#lineChart').getContext('2d');
    Chart.register(...registerables);
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
              drawOnChartArea: false,
            },
          },
        },
      },
    });
  }
  return {
    getInstance() {
      if (!instance) {
        instance = setInstance();
      }
      return instance;
    },
  };
})();

function addChartData(dataset: any) {
  if (!dataset.data) return;
  const chart = lineChart.getInstance();
  chart.data.datasets.push(dataset);
  if (chart.data.datasets.length > 2) {
    chart.options.scales.y1.display = true;
  }
}

function removeChartData() {
  const chart = lineChart.getInstance();
  if (chart.data.datasets.length > 2) {
    chart.data.datasets.pop();
    chart.options.scales.y1.display = false;
  }
}

function renderChart(dataset: any = [], labels: string[] = []) {
  const chart = lineChart.getInstance();
  if (labels.length) {
    chart.data.labels = labels;
  }
  removeChartData();
  addChartData(dataset);
  chart.update();
}
function makeChartdataset(arr: any) {
  return {
    label: arr[0].codeName,
    data: arr.slice().map((v: any) => +v.value),
    borderColor: chartBorderColor(arr),
    yAxisID: arr[0].isMainIndex ? 'y' : 'y1',
  };
}
function setChartData(arr1: any = [], arr2: any = []) {
  const chartLabel = arr1
    .slice()
    .map((value: any) =>
      new Date(value.month.slice(0, 4), value.month.slice(4) - 1)
        .toLocaleString()
        .slice(0, 8),
    );
  if (arr1.length) renderChart(makeChartdataset(arr1), chartLabel);
  if (arr2.length) renderChart(makeChartdataset(arr2), []);
}

function setLeadingIndexByMain(data: any) {
  leadingIndex.innerText = data.find((v: any) => v.isMainIndex).value;
}

function setCoincidentIndexByMain(data: any) {
  coincidentIndex.innerText = data.find((v: any) => v.isMainIndex).value;
}

function setSelectMonth(data: any) {
  selectedMonth.innerHTML = monthFormmater(data[0]);
  selectedMonth.setAttribute('id', data[0]);
}

function setMonthList(data: any) {
  const latestMonths = data.slice(0, 24);
  latestMonths.forEach((value: any) => {
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
