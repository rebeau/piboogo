'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import utils from '@/utils';
import loungeApi from '@/services/loungeApi';
import { SUCCESS } from '@/constants/errorCode';
import { selectedLoungeState } from '@/stores/dataRecoil';
import { useRecoilState } from 'recoil';
import useModal from './useModal';
import { usePathname, useRouter } from 'next/navigation';
import useDevice from './useDevice';
import { LANGUAGES } from '@/constants/lang';
import {
  LOUNGE_TYPE_COMMUNITY,
  LOUNGE_TYPE_JOB_HUNTING,
  LOUNGE_TYPE_JOB_POSTING,
  LOUNGE_TYPE_LEGAL_SERVICE,
  LOUNGE_TYPE_MARKETPLACE,
} from '@/constants/common';
import { SERVICE } from '@/constants/pageURL';
import { useDisclosure } from '@chakra-ui/react';

const useLounge = () => {
  const pathName = usePathname();
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

  const { isOpen, onOpen, onClose } = useDisclosure();

  /*
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (loading) return;
      const scrollBottom =
        document.documentElement.scrollHeight ===
        document.documentElement.scrollTop + window.innerHeight;

      if (scrollBottom) {
        setLoading(true);
      }
    };

    if (isMobile(true)) {
      window.addEventListener('scroll', handleScroll);
      if (loading) {
        setCurrentPage((prevPage) => prevPage + 1);
        setLoading(false);
      }
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [loading]);
  */
  const [loading, setLoading] = useState(false);
  const lastScrollTop = useRef(0);

  const handleScroll = useCallback(() => {
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
          // 1 페이지
          getListLounge();
        }
      }
    }
    lastScrollTop.current = scrollY;
  }, [loading]);

  useEffect(() => {
    if (isMobile(true)) {
      window.addEventListener('scroll', handleScroll);
    }
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

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
        setListLounge((prev) => {
          const newDatas = getNewDatas(
            result.datas,
            listLounge,
            currentPage,
            contentNum,
          );
          const datas = [...prev, ...newDatas];
          return utils.parseSortList(datas);
        });
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

  const handleGetListLoungeAgent = useCallback(() => {
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

  const handleSavePost = useCallback(async (loungeType) => {
    console.log('handleSavePost');
    const param = { loungeType: loungeType, title, content };
    if (link) {
      param.link = link;
    }

    const result = await loungeApi.postLounge(param, files);
    openModal({ text: result?.message });
    if (result?.errorCode === SUCCESS) {
      router.back();
    }
  });

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

  const handleGetLoungeType = () => {
    if (pathName.indexOf(SERVICE.LOUNGE.JOB_POSTING) > -1) {
      return LOUNGE_TYPE_JOB_POSTING;
    } else if (pathName.indexOf(SERVICE.LOUNGE.JOB_HUNTING) > -1) {
      return LOUNGE_TYPE_JOB_HUNTING;
    } else if (pathName.indexOf(SERVICE.LOUNGE.MARKET) > -1) {
      return LOUNGE_TYPE_MARKETPLACE;
    } else if (pathName.indexOf(SERVICE.LOUNGE.LEGAL_SERVICE) > -1) {
      return LOUNGE_TYPE_LEGAL_SERVICE;
    } else if (pathName.indexOf(SERVICE.LOUNGE.COMMUNITY) > -1) {
      return LOUNGE_TYPE_COMMUNITY;
    }
  };

  const handlePostLounge = async (data) => {
    const title = data?.title;
    if (utils.isEmpty(title)) {
      openModal({ text: localeText(LANGUAGES.LOUNGE.PH_ENTER_TITLE) });
      return;
    }
    const content = data?.content;
    if (utils.isEmpty(data.content)) {
      openModal({
        text: localeText(LANGUAGES.LOUNGE.PH_ENTER_YOUR_CONTENT),
      });
      return;
    }
    const param = {
      loungeType: handleGetLoungeType(),
      title: title,
      content: content,
    };
    if (data?.link) {
      param.link = data.link;
    }
    const files = data?.files || [];

    const result = await loungeApi.postLounge(param, files);
    openModal({ text: result?.message });
    if (result?.errorCode === SUCCESS) {
      openModal({
        text: result.message,
        onAgree: () => {
          setSearchBy('');
          onClose(true);
        },
      });
    }
  };

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
    isOpen,
    onOpen,
    onClose,
    //
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
    handleGetListLoungeAgent,
    //
    loungeInfo,
    listLounge,
    //
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
    handlePostLounge,
  };
};

export default useLounge;
