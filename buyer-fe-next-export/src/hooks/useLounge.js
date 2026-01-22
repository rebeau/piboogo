'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import utils from '@/utils';
import loungeApi from '@/services/loungeApi';
import { SUCCESS } from '@/constants/errorCode';
import { selectedLoungeState } from '@/stores/dataRecoil';
import { useRecoilState } from 'recoil';
import useModal from './useModal';
import { useRouter } from 'next/navigation';
import useDevice from './useDevice';

const useLounge = () => {
  const { isMobile } = useDevice();
  const router = useRouter();
  const { openModal } = useModal();

  const [loungeInfo, setLoungeInfo] = useRecoilState(selectedLoungeState);
  const [currentLoungeType, setCurrentLoungeType] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [contentNum, setContentNum] = useState(5);
  const [totalPage, setTotalPage] = useState(1);
  const [searchBy, setSearchBy] = useState('');

  const [listLounge, setListLounge] = useState([]);
  const [firstImage, setFirstImage] = useState(null);
  const [listImage, setListImage] = useState([]);

  const [loading, setLoading] = useState(false);
  /*
  const lastScrollTop = useRef(0);

  const handleScroll = useCallback(async () => {
    console.log(1);
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollY > lastScrollTop.current) {
      if (scrollY + windowHeight >= documentHeight && !loading) {
        if (currentPage !== 1) {
          if (listLounge.length === contentNum) {
            setCurrentPage((prevPage) => prevPage + 1);
          } else {
            getListLounge();
          }
        } else {
          getListLounge();
        }
      }
    }
    lastScrollTop.current = scrollY;
  }, [loading]);

  useEffect(() => {
    if (isMobile(true)) {

      window.addEventListener('scroll', handleScroll);
      return () => {

        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);
  */

  useEffect(() => {
    if (loungeInfo) {
      if (loungeInfo?.loungeImageList) {
        setListImage(loungeInfo.loungeImageList);
        setFirstImage(loungeInfo.loungeImageList[0]);
      }
    }
  }, [loungeInfo]);

  const getLounge = useCallback(async (loungeId) => {
    const param = {
      loungeId: loungeId,
      clientIp: await utils.fetchIp(),
    };

    const result = await loungeApi.getLounge(param);
    if (result?.errorCode === SUCCESS) {
      const data = result.data;
      setLoungeInfo(data);
      if (data?.loungeImageList) {
        setListImage(data.loungeImageList);
        setFirstImage(data.loungeImageList[0]);
      }
    } else {
      setLoungeInfo({});
    }
  });

  const key = 'loungeId';
  const getNewDatas = (resultDatas, existingDatas) => {
    const existingIds = existingDatas.map((item) => item[key]);
    const newDatas = resultDatas.filter(
      (item) => !existingIds.includes(item[key]),
    );
    return newDatas;
  };

  const getListLounge = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    const param = {
      pageNum: currentPage,
      contentNum: contentNum,
      loungeType: currentLoungeType,
    };
    if (searchBy) {
      param.searchBy = searchBy;
    }
    try {
      const result = await loungeApi.getListLounge(param);
      if (result?.errorCode === SUCCESS) {
        if (isMobile(true)) {
          setListLounge((prev) => {
            const newDatas = getNewDatas(
              result.datas,
              listLounge,
              currentPage,
              contentNum,
            );
            return [...prev, ...newDatas];
          });
        } else {
          setListLounge(result.datas);
        }
        setTotalPage(result.totalCount);
      } else {
        if (isMobile(true)) {
          setListLounge((prev) => [...prev, ...[]]);
        } else {
          setListLounge([]);
        }
        setTotalPage(0);
      }
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    if (currentLoungeType) {
      getListLounge();
    }
  }, [currentLoungeType]);

  useEffect(() => {
    if (currentLoungeType && listLounge.length > 0) {
      getListLounge();
    }
  }, [currentPage]);

  const handleSearchLounge = useCallback(() => {
    if (currentPage === 1) {
      getListLounge();
    } else {
      setCurrentPage(1);
    }
  });

  // add, modify
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [content, setContent] = useState('');

  const handleImageFile = useCallback((file, srcData) => {
    if (file && srcData) {
      const tempImages = [...images];
      tempImages.push(srcData);
      setImages(tempImages);

      const tempFiles = [...files];
      tempFiles.push(file);
      setFiles(tempFiles);
    }
  });

  const handleRemoveImage = useCallback((index) => {
    let tempImages = [...images];
    tempImages.splice(index, 1);
    setImages(tempImages);

    let tempFiles = [...files];
    tempFiles.splice(index, 1);
    setFiles(tempFiles);
  });

  const handleActiveAction = useCallback(() => {
    if (title && content) {
      return true;
    } else {
      return false;
    }
  });

  const handleSavePost = async (loungeType) => {
    console.log('handleSavePost', loungeType);
    const param = { loungeType: loungeType, title, content };
    if (link) {
      param.link = link;
    }

    const result = await loungeApi.postLounge(param, files);
    openModal({ text: result?.message });
    if (result?.errorCode === SUCCESS) {
      router.back();
    }
  };

  const handleModifyPost = useCallback(async (loungeType) => {
    console.log('handleModifyPost');
    const param = { loungeId: loungeInfo.loungeId, title, content };
    if (link) {
      param.link = link;
    }
    const result = await loungeApi.patchLounge(param, files);
    if (result?.errorCode === SUCCESS) {
      openModal({
        text: result.message,
        onAgree: () => {
          router.back();
        },
      });
    }
  });
  //

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        resolve(reader.result); // Base64로 읽은 데이터 반환
      };

      reader.onerror = reject; // 오류 처리

      reader.readAsDataURL(file);
    });
  };

  const convertFilesToBase64 = async (files) => {
    try {
      const base64Array = await Promise.all(files.map(convertFileToBase64));
      return base64Array; // 모든 파일의 Base64 값 저장
    } catch (error) {
      console.error('Error reading files:', error);
    }
  };

  return {
    currentLoungeType,
    setCurrentLoungeType,
    //
    currentPage,
    setCurrentPage,
    contentNum,
    setContentNum,
    totalPage,
    setTotalPage,
    searchBy,
    setSearchBy,
    //
    firstImage,
    listImage,
    //
    getLounge,
    getListLounge,
    handleSearchLounge,
    //
    loungeInfo,
    setLoungeInfo,
    listLounge,
    //
    loading,
    setLoading,
    // add, modify
    title,
    setTitle,
    link,
    setLink,
    images,
    setImages,
    files,
    setFiles,
    content,
    setContent,
    //
    handleImageFile,
    handleRemoveImage,
    handleActiveAction,
    //
    handleSavePost,
    handleModifyPost,
  };
};

export default useLounge;
