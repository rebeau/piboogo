'use client';

import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  Box,
  Button,
  Center,
  Divider,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import useLocale from '@/hooks/useLocale';
import useModal from '@/hooks/useModal';
import useMenu from '@/hooks/useMenu';
import firstCategoryApi from '@/services/firstCategoryApi';
import secondCategoryApi from '@/services/secondCategoryApi';
import thirdCategoryApi from '@/services/thirdCategoryApi';
import MainContainer from '@/components/layout/MainContainer';
import Category from '@/components/custom/page/category/MainCategory';
import SubCategory from '@/components/custom/page/category/SubCategory';
import SubSubCategory from '@/components/custom/page/category/SubSubCategory';
import CategoryAddModal from '@/components/custom/page/category/CategoryAddModal';
import { LANGUAGES } from '@/constants/lang';
import { SUCCESS } from '@/constants/errorCode';

const CategoryPage = () => {
  const { localeText } = useLocale();
  const { openModal } = useModal();
  const { listAllCategory, handleAllCategory } = useMenu();
  const [categories, setCategories] = useState([]);
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
      setCategories(listAllCategory);
    }
  }, [listAllCategory]);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const updatedCategories = [...categories];

    if (
      source.droppableId === 'categories' &&
      destination.droppableId === 'categories'
    ) {
      const [movedItem] = updatedCategories.splice(source.index, 1);
      updatedCategories.splice(destination.index, 0, movedItem);
    }

    setCategories(updatedCategories);
  };

  return (
    <MainContainer
      contentHeader={
        <Box w={'10.3125rem'} h={'3rem'}>
          <Button onClick={onOpenAdd} bg={'#7895B2'} color={'white'} w={'100%'}>
            {localeText(LANGUAGES.CATEGORY.ADD_A_CATEGORY)}
          </Button>
        </Box>
      }
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="categories">
          {(provided) => (
            <Box
              {...provided.droppableProps}
              ref={provided.innerRef}
              w={'100%'}
            >
              {categories.map((category, index) => (
                <Draggable
                  key={category.id}
                  draggableId={category.id}
                  index={index}
                >
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {/*
                      <Category category={category} />
                      {category.secondCategoryDataList.map((sub, subIndex) => (
                        <SubCategory key={sub.id} subcategory={sub} />
                      ))}
                      <Divider />
                      */}
                      {category.name}
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>

      {isOpenAdd && (
        <CategoryAddModal isOpen={isOpenAdd} onClose={onCloseAdd} />
      )}
    </MainContainer>
  );
};

export default CategoryPage;
