'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  Box,
  Button,
  Center,
  Divider,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import ContentBR from '@/components/common/ContentBR';
import ContentHeader from '@/components/layout/header/ContentHeader';
import Category from '@/components/custom/page/category/MainCategory';
import SubCategory from '@/components/custom/page/category/SubCategory';
import SubSubCategory from '@/components/custom/page/category/SubSubCategory';
import CategoryAddModal from '@/components/custom/page/category/CategoryAddModal';
import useMenu from '@/hooks/useMenu';
import firstCategoryApi from '@/services/firstCategoryApi';
import { SUCCESS } from '@/constants/errorCode';
import useModal from '@/hooks/useModal';
import secondCategoryApi from '@/services/secondCategoryApi';
import thirdCategoryApi from '@/services/thirdCategoryApi';
import MainContainer from '@/components/layout/MainContainer';

const categoryData = {
  id: '0',
  title: '',
};

const transformIdsToString = (data) => {
  return data.map((item) => {
    const transformedItem = {
      ...item,
      id: String(item.firstCategoryId),
      secondCategoryDataList: item.secondCategoryDataList
        ? item.secondCategoryDataList.map((secondItem) => ({
            ...secondItem,
            id: String(secondItem.secondCategoryId),
            thirdCategoryDataList: secondItem.thirdCategoryDataList
              ? secondItem.thirdCategoryDataList.map((thirdItem) => ({
                  ...thirdItem,
                  id: String(thirdItem.thirdCategoryId),
                }))
              : [],
          }))
        : [],
    };
    return transformedItem;
  });
};

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const CategoryPage = () => {
  const { openModal } = useModal();
  const { localeText } = useLocale();
  const [categories, setCategories] = useState([]);
  const {
    listAllCategory,
    listFirstCategory,
    listSecondCategory,
    listThirdCategory,
    handleAllCategory,
    handleReindexCategories,
    handlePatchReIndexCategories,
  } = useMenu();

  const [firstCategoryTarget, setFirstCategoryTarget] = useState(null);
  const [secondCategoryTarget, setSecondCategoryTarget] = useState(null);

  const {
    isOpen: isOpenAdd,
    onOpen: onOpenAdd,
    onClose: onCloseAdd,
  } = useDisclosure();

  useEffect(() => {
    handleAllCategory();
  }, []);

  useEffect(() => {
    if (listAllCategory.length > 0) {
      const result = transformIdsToString(listAllCategory);
      setCategories(result);
    }
  }, [listAllCategory]);

  const moveCategory = async (draggedId, targetIndex, isEnd) => {
    const updatedCategories = [...categories];
    const draggedCategory = updatedCategories.find(
      (category) => category.id === draggedId,
    );
    const index = updatedCategories.findIndex(
      (category) => category.id === draggedId,
    );

    if (isEnd) {
      let temp = handleReindexCategories(categories);
      const result = await handlePatchReIndexCategories(temp);
    } else {
      updatedCategories.splice(index, 1);
      updatedCategories.splice(targetIndex, 0, draggedCategory);
      setCategories(updatedCategories);
    }
  };

  const moveSubcategory = async (draggedId, targetIndex, categoryId, isEnd) => {
    const updatedCategories = [...categories];
    const category = updatedCategories.find(
      (category) => category.id === categoryId,
    );
    const draggedSubcategory = category.secondCategoryDataList.find(
      (subcategory) => subcategory.id === draggedId,
    );
    const subcategoryIndex = category.secondCategoryDataList.findIndex(
      (subcategory) => subcategory.id === draggedId,
    );

    if (isEnd) {
      let temp = handleReindexCategories(categories);
      const result = await handlePatchReIndexCategories(temp, categoryId);
    } else {
      category.secondCategoryDataList.splice(subcategoryIndex, 1);
      category.secondCategoryDataList.splice(
        targetIndex,
        0,
        draggedSubcategory,
      );
      setCategories(updatedCategories);
    }
  };

  const moveSubsubCategory = async (
    draggedId,
    targetIndex,
    categoryId,
    subcategoryId,
    isEnd,
  ) => {
    const updatedCategories = [...categories];
    const category = updatedCategories.find(
      (category) => category.id === categoryId,
    );
    const subcategory = category.secondCategoryDataList.find(
      (subcategory) => subcategory.id === subcategoryId,
    );
    const draggedSubsubCategory = subcategory.thirdCategoryDataList.find(
      (subsub) => subsub.id === draggedId,
    );
    const subsubcategoryIndex = subcategory.thirdCategoryDataList.findIndex(
      (subsub) => subsub.id === draggedId,
    );

    if (isEnd) {
      let temp = handleReindexCategories(categories);
      const result = await handlePatchReIndexCategories(
        temp,
        categoryId,
        subcategoryId,
      );
    } else {
      subcategory.thirdCategoryDataList.splice(subsubcategoryIndex, 1);
      subcategory.thirdCategoryDataList.splice(
        targetIndex,
        0,
        draggedSubsubCategory,
      );
      setCategories(updatedCategories);
    }
  };

  const addCategory = async (name) => {
    const firstIdx = categories.length + 1;
    const param = {
      idx: firstIdx,
      name: name,
    };
    const result = await firstCategoryApi.postFirstCategory(param);
    if (result?.errorCode === SUCCESS) {
      console.log(result);
      const tempCategory = {
        firstCategoryId: result.data.firstCategoryId,
        id: String(result.data.firstCategoryId),
        idx: firstIdx,
        name: name,
        secondCategoryDataList: [],
      };
      setCategories([...categories, tempCategory]);
    }
  };

  const addSubcategory = async (categoryId, name) => {
    const updatedCategories = [...categories];
    const category = updatedCategories.find((cat) => {
      return cat.id === categoryId;
    });

    if (category && name) {
      const param = {
        firstCategoryId: categoryId,
        idx: listFirstCategory.length + 1,
        name: name,
      };
      const result = await secondCategoryApi.postSecondCategory(param);
      if (result?.errorCode === SUCCESS) {
        const tempCategory = {
          secondCategoryId: result.data.secondCategoryId,
          id: String(result.data.secondCategoryId),
          name: name,
          thirdCategoryDataList: [],
        };
        category.secondCategoryDataList.push(tempCategory);
        setCategories(updatedCategories);
      }
    } else if (category) {
      setFirstCategoryTarget(category);
      onOpenAdd();
    }
  };

  const addSubsubCategory = async (categoryId, subcategoryId, name) => {
    const updatedCategories = [...categories];
    const category = updatedCategories.find((cat) => {
      return cat.id === categoryId;
    });
    const subcategory = category.secondCategoryDataList.find((subcat) => {
      return subcat.id === subcategoryId;
    });

    if (category && subcategory && name) {
      const param = {
        firstCategoryId: categoryId,
        secondCategoryId: subcategoryId,
        idx: listFirstCategory.length + 1,
        name: name,
      };
      const result = await thirdCategoryApi.postThirdCategory(param);
      if (result?.errorCode === SUCCESS) {
        const tempCategory = {
          id: String(result.data.thirdCategoryId),
          name: name,
          thirdCategoryDataList: [],
        };
        subcategory.thirdCategoryDataList.push(tempCategory);
        setCategories(updatedCategories);
      }
    } else if (category && subcategory) {
      setFirstCategoryTarget(category);
      setSecondCategoryTarget(subcategory);
      onOpenAdd();
    }
  };

  const deleteCategory = (categoryId) => {
    openModal({
      type: 'confirm',
      text: localeText(LANGUAGES.INFO_MSG.DELETE_CATEGORY),
      onAgree: async () => {
        const param = {
          firstCategoryIds: [Number(categoryId)],
        };
        console.log(param);
        const result = await firstCategoryApi.deleteFirstCategory(param);
        if (result?.errorCode === SUCCESS) {
          const updatedCategories = categories.filter(
            (cat) => cat.id !== categoryId,
          );
          const temp = handleReindexCategories(updatedCategories);
          setCategories(temp);
        } else {
          setTimeout(() => {
            openModal({
              text:
                result?.message ||
                localeText(LANGUAGES.INFO_MSG.UNDEFINED_ERROR),
            });
          });
        }
      },
    });
  };

  const deleteSubcategory = (subcategoryId, categoryId) => {
    openModal({
      type: 'confirm',
      text: localeText(LANGUAGES.INFO_MSG.DELETE_CATEGORY),
      onAgree: async () => {
        const param = {
          secondCategoryIds: [Number(subcategoryId)],
        };
        const result = await secondCategoryApi.deleteSecondCategory(param);
        if (result?.errorCode === SUCCESS) {
          const updatedCategories = [...categories];
          const category = updatedCategories.find(
            (cat) => cat.id === categoryId,
          );
          category.secondCategoryDataList =
            category.secondCategoryDataList.filter(
              (subcat) => subcat.id !== subcategoryId,
            );
          const temp = handleReindexCategories(updatedCategories);
          setCategories(temp);
        } else {
          setTimeout(() => {
            openModal({
              text:
                result?.message ||
                localeText(LANGUAGES.INFO_MSG.UNDEFINED_ERROR),
            });
          });
        }
      },
    });
  };

  const deleteSubsubCategory = (
    subsubcategoryId,
    categoryId,
    subcategoryId,
  ) => {
    openModal({
      type: 'confirm',
      text: localeText(LANGUAGES.INFO_MSG.DELETE_CATEGORY),
      onAgree: async () => {
        const param = {
          thirdCategoryIds: [Number(subsubcategoryId)],
        };
        const result = await thirdCategoryApi.deleteThirdCategory(param);
        if (result?.errorCode === SUCCESS) {
          const updatedCategories = [...categories];
          const category = updatedCategories.find(
            (cat) => cat.id === categoryId,
          );
          const subcategory = category.secondCategoryDataList.find(
            (subcat) => subcat.id === subcategoryId,
          );
          subcategory.thirdCategoryDataList =
            subcategory.thirdCategoryDataList.filter(
              (subsub) => subsub.id !== subsubcategoryId,
            );
          const temp = handleReindexCategories(updatedCategories);
          setCategories(temp);
        } else {
          setTimeout(() => {
            openModal({
              text:
                result?.message ||
                localeText(LANGUAGES.INFO_MSG.UNDEFINED_ERROR),
            });
          });
        }
      },
    });
  };

  const handleCategoryTitleChange = useCallback(
    (e, categoryId, subCategoryId = null, subSubCategoryId = null) => {
      const updatedCategories = [...categories];

      const category = updatedCategories.find((cat) => cat.id === categoryId);

      if (subCategoryId) {
        const subCategory = category.secondCategoryDataList.find(
          (sub) => sub.id === subCategoryId,
        );
        if (subSubCategoryId) {
          const subSubCategory = subCategory.thirdCategoryDataList.find(
            (subsub) => subsub.id === subSubCategoryId,
          );
          subSubCategory.name = e.target.value;
        } else {
          subCategory.name = e.target.value;
        }
      } else {
        category.name = e.target.value;
      }

      setCategories(updatedCategories);
    },
  );

  return (
    <MainContainer
      contentHeader={
        <Box w={'10.3125rem'} h={'3rem'}>
          <Button
            onClick={() => {
              onOpenAdd();
            }}
            px={'1.25rem'}
            py={'0.63rem'}
            borderRadius={'0.25rem'}
            boxSizing={'border-box'}
            bg={'#7895B2'}
            h={'100%'}
            w={'100%'}
            _disabled={{
              bg: '#7895B290',
            }}
            _hover={{
              opacity: 0.8,
            }}
          >
            <Text
              color={'#FFF'}
              fontSize={'1rem'}
              fontWeight={400}
              lineHeight={'1.75rem'}
            >
              {localeText(LANGUAGES.CATEGORY.ADD_A_CATEGORY)}
            </Text>
          </Button>
        </Box>
      }
    >
      <DndProvider backend={HTML5Backend}>
        <Box w={'100%'}>
          {categories.map((category, index) => (
            <Category
              key={index}
              category={category}
              index={index}
              moveCategory={moveCategory}
              deleteCategory={deleteCategory}
              addSubcategory={addSubcategory}
              handleCategoryTitleChange={handleCategoryTitleChange}
            >
              {category.secondCategoryDataList.map((subcategory, subIndex) => (
                <SubCategory
                  key={subcategory.id}
                  subcategory={subcategory}
                  categoryId={category.id}
                  index={subIndex}
                  moveSubcategory={moveSubcategory}
                  deleteSubcategory={deleteSubcategory}
                  addSubcategory={addSubcategory}
                  addSubsubCategory={addSubsubCategory}
                  handleCategoryTitleChange={handleCategoryTitleChange}
                >
                  {subcategory.thirdCategoryDataList.map(
                    (subsubcategory, subsubIndex) => (
                      <SubSubCategory
                        key={subsubcategory.id}
                        subsubcategory={subsubcategory}
                        categoryId={category.id}
                        subcategoryId={subcategory.id}
                        index={subsubIndex}
                        moveSubsubCategory={moveSubsubCategory}
                        deleteSubsubCategory={deleteSubsubCategory}
                        addSubsubCategory={addSubsubCategory}
                        handleCategoryTitleChange={handleCategoryTitleChange}
                      />
                    ),
                  )}
                </SubCategory>
              ))}
              <ContentBR h={'1rem'} />
              <Divider borderBottom={'1px solid #AEBDCA'} />
              <ContentBR h={'1rem'} />
            </Category>
          ))}
          {categories.length === 0 && (
            <Center w={'100%'} h={'10rem'}>
              <Text fontSize={'1.5rem'} fontWeight={500} lineHeight={'1.75rem'}>
                {localeText(LANGUAGES.INFO_MSG.NO_CATEGORIES_FOUND)}
              </Text>
            </Center>
          )}
        </Box>
      </DndProvider>
      {isOpenAdd && (
        <CategoryAddModal
          firstCategoryTarget={firstCategoryTarget}
          secondCategoryTarget={secondCategoryTarget}
          isOpen={isOpenAdd}
          onClose={(ret, name, first, second) => {
            setFirstCategoryTarget(null);
            setSecondCategoryTarget(null);
            if (ret) {
              if (second) {
                addSubsubCategory(first.id, second.id, name);
              } else if (first) {
                addSubcategory(first.id, name);
              } else {
                addCategory(name);
              }
            }
            onCloseAdd();
          }}
        />
      )}
    </MainContainer>
  );
};

export default CategoryPage;
