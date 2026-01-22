'use client';

import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { Box, Button, Center, HStack, Input, Text } from '@chakra-ui/react';
import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import CustomIcon from '@/components/icon/CustomIcon';

const Category = ({
  category,
  index,
  moveCategory,
  children,
  deleteCategory,
  addSubcategory,
  handleCategoryTitleChange,
}) => {
  const { lang, localeText } = useLocale();

  const [{ isDragging }, drag] = useDrag({
    type: 'CATEGORY',
    item: { id: category.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        // 드래그가 끝났을 때 moveCategory 호출
        setTimeout(() => {
          moveCategory(item.id, index, true);
        });
      }
    },
  });

  const [, drop] = useDrop({
    accept: 'CATEGORY',
    hover: (item) => {
      if (item.index !== index) {
        moveCategory(item.id, index);
        item.index = index; // 업데이트된 인덱스를 반영
      }
    },
  });

  return (
    <Box h={'100%'}>
      <HStack spacing={'0.75rem'}>
        <Box
          ref={(node) => drag(drop(node))}
          cursor={isDragging ? 'grabbing' : 'grab'}
          opacity={isDragging ? 0.5 : 1}
          w={'48.25rem'}
          border={'1px solid #A7C3D2'}
          borderRadius={'0.25rem'}
          // py={'0.75rem'}
          px={'1rem'}
          bg={'#FFF'}
          my={'1.5rem'}
        >
          <HStack
            spacing={'1rem'}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Box w={'43.75rem'} h={'3rem'}>
              <Input
                readOnly
                p={0}
                placeholder={localeText(
                  LANGUAGES.CATEGORY.PH_ENTER_SUBCATEGORY,
                )}
                w={'100%'}
                h={'100%'}
                _placeholder={{
                  color: '#A7C3D2',
                  fontSize: '0.9375rem',
                  fontWeight: 400,
                  lineHeight: '1.5rem',
                }}
                fontSize={'0.9375rem'}
                lineHeight={'1.5rem'}
                border={0}
                onChange={(e) => {
                  handleCategoryTitleChange(e, category.id);
                }}
                value={category.name || ''}
                bg={'#FFF'}
              />
            </Box>
            <Center
              w={'1.5rem'}
              h={'1.5rem'}
              onClick={() => deleteCategory(category.id)}
              cursor={'pointer'}
            >
              <CustomIcon
                w={'100%'}
                h={'100%'}
                name={'close'}
                color={'#7895B2'}
              />
            </Center>
          </HStack>
        </Box>
        {!isDragging && (
          <Box w={'11.5rem'}>
            <Button
              onClick={() => {
                addSubcategory(category.id);
              }}
              px={'1.25rem'}
              py={'0.63rem'}
              borderRadius={'0.25rem'}
              boxSizing={'border-box'}
              bg={'transparent'}
              border={'1px solid #7895B2'}
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
                color={'#7895B2'}
                fontSize={lang === 'KR' ? '0.9375rem' : '1rem'}
                fontWeight={400}
                lineHeight={'1.75rem'}
              >
                {localeText(LANGUAGES.CATEGORY.ADD_SUB_CATEGORY)}
              </Text>
            </Button>
          </Box>
        )}
      </HStack>
      {children}
    </Box>
  );
};

export default Category;
