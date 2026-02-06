
import { MasterItem } from './types';

export const MASTER_ITEMS: MasterItem[] = [
  { 
    id: 'edu-100m-2.5p', 
    name: '교육비 (100명 미만 및 2.5시간 이상)', 
    units: ['시간', '차수'], 
    defaultPrice: 1000000, 
    description: '차수당 참석인원 100명 미만이고, 차수당 2.5시간 이상의 교육, 특강, 워크숍을 진행하는 상황의 교육비(강의료)입니다.' 
  },
  { 
    id: 'edu-100m-2.5m', 
    name: '교육비 (100명 미만 및 2.5시간 미만)', 
    units: ['차수'], 
    defaultPrice: 2500000, 
    description: '차수당 참석인원 100명 미만이고, 차수당 2.5시간 미만의 교육, 특강, 워크숍을 진행하는 상황의 교육비(강의료)입니다.' 
  },
  { 
    id: 'edu-100p-2.5p', 
    name: '교육비 (100명 이상 및 2.5시간 이상)', 
    units: ['시간', '차수'], 
    defaultPrice: 2000000, 
    description: '차수당 참석인원 100명 이상이고, 차수당 2.5시간 이상의 교육, 특강, 워크숍을 진행하는 상황의 교육비(강의료)입니다.' 
  },
  { 
    id: 'edu-100p-2.5m', 
    name: '교육비 (100명 이상 및 2.5시간 미만)', 
    units: ['차수'], 
    defaultPrice: 4000000, 
    description: '차수당 참석인원 100명 이상이고, 차수당 2.5시간 미만의 교육, 특강, 워크숍을 진행하는 상황의 교육비(강의료)입니다.' 
  },
  { 
    id: 'tr-kangwon-chung-chong', 
    name: '교통출장비 (강원/충청)', 
    units: ['명'], 
    defaultPrice: 300000, 
    description: '대한민국 충청도, 강원도 지역에서 교육 진행 시 발생하는 교통출장비입니다. (대전, 세종, 오송, 천안, 청주, 충주, 제천, 강릉, 춘천, 원주 등)' 
  },
  { 
    id: 'tr-chon-la-kyung-sang', 
    name: '교통출장비 (전라/경상)', 
    units: ['명'], 
    defaultPrice: 400000, 
    description: '대한민국 전라도, 경상도 지역에서 교육 진행 시 발생하는 교통출장비입니다. (전주, 정읍, 익산, 광주, 여수, 순천, 대구, 구미, 울산, 포항, 부산, 창원 등)' 
  },
  { 
    id: 'tr-jeju', 
    name: '교통출장비 (제주)', 
    units: ['명'], 
    defaultPrice: 500000, 
    description: '대한민국 제주도 지역에서 교육 진행 시 발생하는 교통출장비입니다. (제주, 서귀포, 함덕, 조천 등)' 
  },
  { 
    id: 'studio-pd-4m', 
    name: '스튜디오/PD비 (4시간 미만)', 
    units: ['차수'], 
    defaultPrice: 600000, 
    description: '온라인 형태로 차수당 4시간 미만 교육을 진행할 경우 운영비(스튜디오/PD비)입니다.' 
  },
  { 
    id: 'studio-pd-4p', 
    name: '스튜디오/PD비 (4시간 이상)', 
    units: ['차수'], 
    defaultPrice: 1000000, 
    description: '온라인 형태로 차수당 4시간 이상 교육을 진행할 경우 운영비(스튜디오/PD비)입니다.' 
  },
  { 
    id: 'op-fee', 
    name: '운영비', 
    units: ['명', '차수'], 
    defaultPrice: 400000, 
    description: '오프라인으로 진행되는 교육, 워크숍의 운영 지원을 위해 파견되는 운영자 비용입니다.' 
  },
  { 
    id: 'video-capture', 
    name: '현장영상촬영비', 
    units: ['명', '차수'], 
    defaultPrice: 400000, 
    description: '오프라인으로 진행되는 교육, 워크숍의 현장 영상 촬영을 위해 파견되는 운영자 비용입니다.' 
  },
  { 
    id: 'edu-split-neg', 
    name: '교육비(분반_협상)', 
    units: ['시간', '차수'], 
    defaultPrice: 1000000, 
    description: '협상 주제 교육에서 분반을 진행할 경우 발생되는 교육비(강의료)입니다.' 
  },
  { 
    id: 'edu-split-recruit', 
    name: '교육비(분반_면접관)', 
    units: ['시간', '차수'], 
    defaultPrice: 500000, 
    description: '면접관, 채용 주제 교육에서 추가 분반을 진행할 경우 해당 분반에 대해 발생되는 교육비(강의료)입니다.' 
  },
  { 
    id: 'scout-interviewee', 
    name: '섭외비(면접자)', 
    units: ['명'], 
    defaultPrice: 150000, 
    description: '면접관, 채용 주제 교육 시 모의면접(시뮬레이션)에서 피면접자(지원자) 역할을 수행할 인원의 섭외 비용입니다.' 
  },
  { 
    id: 'material-fee', 
    name: '교재비', 
    units: ['부'], 
    defaultPrice: 10000, 
    description: '교재 인쇄를 진행할 경우 발생되는 비용입니다.' 
  },
  { 
    id: 'content-design', 
    name: '내용설계비', 
    units: ['회'], 
    defaultPrice: 0, 
    description: '고객사 요청에 따라 교육, 워크숍 내용에 맞춤화 또는 개발 작업이 진행될 때 발생하는 비용입니다. 차수당 교육비의 50%를 기본으로 입력하고, 과업난이도에 따라 작업자가 조정합니다.' 
  },
  { 
    id: 'course-dev', 
    name: '과정개발비', 
    units: ['시간'], 
    defaultPrice: 10000000, 
    description: '강의안을 개발한 뒤 강의안 PPT 원본파일을 고객사에 납품하는 경우에 발생하는 비용입니다.' 
  },
  { 
    id: 'diag-fee', 
    name: '진단비', 
    units: ['명'], 
    defaultPrice: 200000, 
    description: '성과백신 진단 프로그램을 진행할 때 발생하는 1인당 비용입니다.' 
  },
  { 
    id: 'diag-video-fee', 
    name: '진단+영상비', 
    units: ['명'], 
    defaultPrice: 500000, 
    description: '성과백신 진단 프로그램과 진단 결과에 따른 개인별 맞춤 영상제공이 포함될 경우 발생하는 1인당 비용입니다.' 
  },
  { 
    id: 'debrief-video', 
    name: '디브리핑영상비', 
    units: ['회'], 
    defaultPrice: 500000, 
    description: '성과백신 진단 결과에 대한 디브리핑 세션을 영상 스트리밍으로 진행 시 발생하는 비용입니다.' 
  },
  { 
    id: 'debrief-live', 
    name: '디브리핑라이브비', 
    units: ['시간'], 
    defaultPrice: 1000000, 
    description: '성과백신 진단 결과에 대한 디브리핑 세션을 라이브로 진행 시 발생하는 비용입니다.' 
  },
  { 
    id: 'debrief-workshop', 
    name: '디브리핑워크숍비', 
    units: ['회'], 
    defaultPrice: 3000000, 
    description: '성과백신 진단 결과에 대한 디브리핑 세션을 3시간 진행 시 발생하는 비용입니다.' 
  },
  { 
    id: 'debrief-1on1-non-exec', 
    name: '디브리핑일대일비(비임원)', 
    units: ['시간', '명'], 
    defaultPrice: 800000, 
    description: '성과백신 진단 결과에 대한 디브리핑 세션을 학습자 개인(비임원급)에게 일대일 방식으로 진행 시 발생하는 비용입니다.' 
  },
  { 
    id: 'debrief-1on1-exec', 
    name: '디브리핑일대일비(임원)', 
    units: ['시간', '명'], 
    defaultPrice: 1000000, 
    description: '성과백신 진단 결과에 대한 디브리핑 세션을 학습자 개인(임원급)에게 일대일 방식으로 진행 시 발생하는 비용입니다.' 
  },
  { 
    id: 'coaching-1on1-non-exec', 
    name: '코칭비(일대일_비임원)', 
    units: ['시간', '명', '차수'], 
    defaultPrice: 800000, 
    description: '비임원급 학습자와 일대일 코칭 진행 시 발생하는 비용입니다.' 
  },
  { 
    id: 'coaching-1on1-exec', 
    name: '코칭비(일대일_임원)', 
    units: ['시간', '명', '차수'], 
    defaultPrice: 1000000, 
    description: '임원급 학습자와 일대일 코칭 진행 시 발생하는 비용입니다.' 
  },
  { 
    id: 'coaching-group', 
    name: '코칭비(그룹)', 
    units: ['시간', '그룹', '차수'], 
    defaultPrice: 1000000, 
    description: '그룹코칭 진행 시 발생하는 비용입니다.' 
  },
  { 
    id: 'video-sub-lms', 
    name: '영상구독비(LMS)', 
    units: ['명'], 
    defaultPrice: 50000, 
    description: '고객사의 LMS를 이용하여 마이크로러닝 영상을 구독할 경우 발생하는 비용입니다.' 
  },
  { 
    id: 'video-sub-hsg', 
    name: '영상구독비(HSG페이지)', 
    units: ['편'], 
    defaultPrice: 500000, 
    description: 'HSG의 스트리밍 페이지를 이용하여 마이크로러닝 영상을 구독할 경우 발생하는 비용입니다.' 
  },
  { 
    id: 'video-prod-5m', 
    name: '영상제작비(편당 5분)', 
    units: ['편'], 
    defaultPrice: 4000000, 
    description: '5분 내외의 영상을 제작할 경우 발생하는 비용입니다.' 
  },
  { 
    id: 'video-prod-10m', 
    name: '영상제작비(편당 10분)', 
    units: ['편'], 
    defaultPrice: 6000000, 
    description: '10분 내외의 영상을 제작할 경우 발생하는 비용입니다.' 
  },
  { 
    id: 'video-prod-15m', 
    name: '영상제작비(편당 15분)', 
    units: ['편'], 
    defaultPrice: 8000000, 
    description: '15분 내외의 영상을 제작할 경우 발생하는 비용입니다.' 
  },
  { 
    id: 'column-existing', 
    name: '칼럼비(기존)', 
    units: ['편'], 
    defaultPrice: 300000, 
    description: '기존에 제작되어 있던 칼럼을 납품하는 경우 발생하는 비용입니다.' 
  },
  { 
    id: 'column-edit', 
    name: '칼럼비(편집)', 
    units: ['편'], 
    defaultPrice: 500000, 
    description: '기존에 작성되어 있던 칼럼을 약간의 편집, 수정, 맞춤화를 진행한 뒤 납품하는 경우 발생하는 비용입니다.' 
  },
  { 
    id: 'column-new', 
    name: '칼럼비(신규)', 
    units: ['편'], 
    defaultPrice: 700000, 
    description: '새롭게 칼럼을 작성하여 납품하는 경우 발생하는 비용입니다.' 
  },
  { 
    id: 'onboarding-pkg', 
    name: '온보딩패키지', 
    units: ['개'], 
    defaultPrice: 100000, 
    description: '온보딩패키지를 납품하는 경우 발생하는 비용입니다.' 
  },
  { 
    id: 'toolkit-existing', 
    name: '툴킷(기존)', 
    units: ['개'], 
    defaultPrice: 1200000, 
    description: '기존에 제작되어 있던 툴킷을 납품하는 경우 발생하는 비용입니다.' 
  },
  { 
    id: 'toolkit-edit', 
    name: '툴킷(편집)', 
    units: ['개'], 
    defaultPrice: 1500000, 
    description: '기존에 제작되어 있던 툴킷을 약간의 편집, 수정, 맞춤화를 진행한 뒤 납품하는 경우 발생하는 비용입니다.' 
  },
  { 
    id: 'toolkit-new', 
    name: '툴킷(신규)', 
    units: ['개'], 
    defaultPrice: 2000000, 
    description: '새롭게 툴킷을 제작하여 납품하는 경우 발생하는 비용입니다.' 
  },
];

export const getMasterItemById = (id: string) => MASTER_ITEMS.find(item => item.id === id) || MASTER_ITEMS[0];
