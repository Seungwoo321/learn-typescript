# 경기종합지수 대시보드 만들기 백엔드

캡틴판교님의 타입스크립트 실전 프로젝트의 강의를 수강 중 "코로나 세계 현황판" 만들기에서 사용중인 API가 만료되었습니다. 이를 대체하는 API를 사용하는 백엔드 프로젝트 입니다.

## 기존 API

- 강의에서 진행하는 최종 프로젝트 "코로나 세계 현황판" 만들기에서 사용한 API 입니다.

### 코로나 현황 요약 조회

- url : <https://api.covid19api.com/summary>
- 표시 데이터:
  - 전체 국가의 총 감염자 수
  - 국가별 감염자 수 내림차순 정렬
  - 마지막 갱신 날짜
  - 전체 국가의 총 사망자 수
  - 전체 국가의 총 회복자 수

### 국가별 상태별로 조회

- url : <https://api.covid19api.com/country/${countryCode}/status/${status}>
- 표시 데이터:
  - 조회 국가의 전체 사망자 수
  - 최근 날짜부터 사망자 수
  - 조회 국가의 전체 회복자 수
  - 최근 날짜부터 회복자 수
  - 최근 2주간의 국가별 감염자 추이 차트

## 신규 API

- "경기종합지수 대시보드" 만들기에 사용하는 API 입니다.

### GET /learn-ts/months

- Description
  - 조회가능한 월 목록 조회 (2001년 1월 부터 최근 선행종합지수 업데이트 월까지)
- Response body

    ```json
    {
        "data": [
            "202304",
            "202303"
        ]
    }

    ```

### GET /learn-ts/months/:month/indexes/:indexName/compositions

- Description
  - 선택 월 메인지수(선행종합지수/동행종합지수)의 각 구성지표 값 조회
- Params
  - `months`
    - Type: `String`
    - Value: `YYYYMM` Format
  - `indexName`
    - Type: `String`
    - Value: `leading` or `coincident`

- Response Body

    ```json
    {
        "data": [
            {
                "isMainIndex": true,
                "code": "A01",
                "codeName": " 선행종합지수(2020＝100)",
                "codeNameEng": " Composite Leading Index (2020＝100)",
                "value": "109.4",
            },
            {
                "isMainIndex": false,
                "code": "A0101",
                "codeName": " 재고순환지표(%p)",
                "codeNameEng": " Inventory circulation indicator",
                "value": "-16.9"
            },
            {
                "isMainIndex": false,
                "code": "A0102",
                "codeName": " 경제심리지수",
                "codeNameEng": " Economic Sentiment Index",
                "value": "92.3"
            }
        ]
    }
    ```

### GET /learn-ts/indicators/:code/latest

- Description
  - 최근 24개월의 지표 값 조회
- Params
  - `code`
    - Type: `String`
    - Value: `A01`과 같은 코드 값

- Response Body

    ```json
    {
        "data": [
            {
                "code": "B02",
                "codeName": " 동행종합지수(2020＝100)",
                "codeNameEng": " Composite Coincident Index (2020＝100)",
                "month": "202105",
                "value": "103.8"
            },
            {
                "code": "B02",
                "codeName": " 동행종합지수(2020＝100)",
                "codeNameEng": " Composite Coincident Index (2020＝100)",
                "month": "202106",
                "value": "103.8"
            }
        ]
    }
    ```

## KOSIS API 사용 방법

- 통계자료를 조회 하는 방법으로 조회할 자료를 등록해서 미리 생성된 URL로 조회 하는 "자료등록 방법"과 파라메터를 변경하며 조회하는 "통계표선택 방법"이 있습니다.

### 자료 등록 방법 조회

1. 통계표 단위로 자료를 등록합니다.
2. 등록된 통계표에서 선택한 항목과 지수의 레벨/개별 조건으로 URL을 생성 합니다.
    - 하나의 통계표에서 여러개의 URL을 생성할 수 있습니다.
    - 생성된 URL에 포함된 생성 시간이 고유함을 구분하는 키로 사용되는 것으로 추측됩니다.
    - 출력 포맷(json/sdmx)과 조회기간 설정(기간설정/최근시점기준)을 파라메터로 변경 할 수 있습니다.
3. 생성된 URL로 호출합니다.

- 다음은 이 프로젝트 사용한 URL의 선택 조건 입니다.

// TODO

### 통계표 선택 방법 조회

- 모든 조회 조건을 파라메터로 전달해서 호출 합니다.
- 다음은 이 프로젝트에서 사용한 파라메터에 대한 정보입니다.

#### 공통 파라메터

- url: <https://kosis.kr/openapi/Param/statisticsParameterData.do?method=getList>
- apiKey: `개별 발급`
- format: `json`
- prdSe: `M`
- outputFields: (option) 응답필드(출력변수 선택)
- 시점기준
  - startPrdDe: 시작수록시점
  - endPrdDe: 종료수록시점
- 최신자료기준
  - newEstPrdCnt: 최근수록시점 개수
  - prdInterval: 수록시점 간격

#### 변경 파라메터

- orgId

    |값|기관|
    |--|--|
    |101|통계청|

- tblId

    |값|통계표|
    |--|--|
    |DT_1C8015|경기종합지수(2020=100)(10차)|
    |DT_1C8016|경기종합지수(2020=100) 구성지표 시계열 (10차)|

- itmId

    |itmId|항목|
    |--|--|
    |T1|경기종합지수|

- objL1~8

  - DT_1C8015

    값|분류|레벨
    --|--|--
    A00|선행종합지수(2020=100)|1
    A01|선행종합지수 전월비(%)|1
    A02|선행종합지수 구성지표 증감률|1
    A0201|재고순환지표(전월차)(%p)|2
    A0202|경제심리지수(전월차)(p)|2
    A0203|기계류내수출하지수(선박제외)(전월비)(%)|2
    A0204|건설수주액(전월비)(%)|2
    A0205|수출입물가비율(전월비)(%)|2
    A0206|코스피(전월비)(%)|2
    A0207|장단기금리차(전월차)(%p)|2
    A03|선행지수 순환변동치|1
    A04|〔순환변동치 전월차〕(p)|1
    A05|선행지수 전년동월비(%)|1
    A06|〔전년동월비 전월차〕(%p)|1
    B00|동행종합지수(2020=100)|1
    B01|동행종합지수 전월비(%)|1
    B02|동행종합지수 구성지표 증감률|1
    B0201|광공업생산지수(전월비)(%)|2
    B0202|서비스업생산지수(도소매업제외)(전월비)(%)|2
    B0203|건설기성액(전월비)(%)|2
    B0204|소매판매액지수(전월비)(%)|2
    B0205|내수출하지수(전월비)(%)|2
    B0206|수입액(전월비)(%)|2
    B0207|비농림어업취업자수(전월비)(%)|2
    B03|동행지수 순환변동치|1
    B04|〔순환변동치 전월차〕(p)|1
    C00|후행종합지수(2020=100)|1
    C01|후행종합지수 전월비(%)|1
    C02|후행종합지수 구성지표 증감률|1
    C0201|생산자제품재고지수(전월비)(%)|2
    C0202|소비자물가지수변화율(서비스)(전월차)(%p)|2
    C0203|소비재수입액(전월비)(%)|2
    C0204|취업자수(전월비)(%)|2
    C0205|CP유통수익률(전월차)(%p)|2

  - DT_1C8016

    값|분류|레벨
    --|--|--
    A01|선행종합지수(2020=100)|1|
    A0101|재고순환지표(%p)|2
    A0102|경제심리지수|2
    A0103|기계류내수출하지수(선박제외)(2020=100)|2
    A0104|건설수주액(실질)(십억원)|2
    A0105|수출입물가비율(2015=100)|2
    A0106|코스피(1980.1.4=100)|2
    A0107|장단기금리차(%p)|2
    B02|동행종합지수(2020=100)|1|
    B0201|광공업생산지수(2020=100)|2
    B0202|서비스업생산지수(도소매업제외)(2020=100)|2
    B0203|건설기성액(실질)(십억원)|2
    B0204|소매판매액지수(2020=100)|2
    B0205|내수출하지수(2020=100)|2
    B0206|수입액(실질)(백만불)|2
    B0207|비농림어업취업자수(천명)|2
    C03|후행종합지수(2020=100)|1|
    C0301|생산자제품재고지수(2020=100)|2
    C0302|소비자물가지수변화율(서비스)|2
    C0303|소비재수입액(실질)(백만불)|2
    C0304|취업자수(천명)|2
    C0305|CP유통수익률(%p)|2
