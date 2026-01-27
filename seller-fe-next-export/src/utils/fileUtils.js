'use client';

import { isClient } from './deviceUtils';
import axios from 'axios';

export const parseB64UrlToFile = async (base64Data, filename) => {
  if (!isClient()) return;
  // Base64 데이터를 디코딩하여 바이너리 데이터를 얻기
  const byteCharacters = window.atob(base64Data.split(',')[1]); // `,` 이후 부분이 base64 데이터입니다.
  const byteArrays = [];

  // Base64 데이터를 byte로 변환
  for (let offset = 0; offset < byteCharacters.length; offset++) {
    const byte = byteCharacters.charCodeAt(offset);
    byteArrays.push(byte);
  }

  // Blob으로 변환
  const byteArray = new Uint8Array(byteArrays);
  const blob = new Blob([byteArray]);

  // Blob을 File 객체로 변환
  const file = new File([blob], filename, { type: blob.type });

  return file;
};

export const parseUrlToFile = async (url, filename) => {
  try {
    console.log('url', url);
    // URL에서 파일을 다운로드 (fetch)
    const response = await axios.get(url, {
      responseType: 'blob', // Blob 데이터로 응답받기
      headers: {
        // 'Content-Type': 'application/octet-stream', // 요청에 맞는 Content-Type 설정
 
      },
    });
    // 응답이 정상인지 확인
    if (response.status !== 200) {
      throw new Error('파일 다운로드 실패');
    }
    // 응답에서 Blob 데이터 가져오기
    const blob = response.data;

    // Blob을 File 객체로 변환
    const file = new File([blob], filename, { type: blob.type });
    return file;
  } catch (error) {
    console.error('파일 다운로드 오류:', error);
    // 에러 메시지 로그 출력
    if (error.response) {
      console.error('응답 오류:', error.response);
    } else if (error.request) {
      console.error('요청 오류:', error.request);
    } else {
      console.error('기타 오류:', error.message);
    }
    // throw error; // 오류를 다시 던지기
  }
};
