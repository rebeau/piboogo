'use client';

import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import {
  Box,
  Button,
  Center,
  HStack,
  Img,
  Input,
  Text,
} from '@chakra-ui/react';
import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import CustomIcon from '@/components/icon/CustomIcon';
import IconCategory from '@public/svgs/icon/category.svg';

const SubSubCategory = ({
  subsubcategory,
  categoryId,
  subcategoryId,
  index,
  moveSubsubCategory,
  deleteSubsubCategory,
  addSubsubCategory,
  handleCategoryTitleChange,
}) => {
  const { lang, localeText } = useLocale();
  const [{ isDragging }, drag] = useDrag({
    type: 'SUBSUBCATEGORY',
    item: { id: subsubcategory.id, index, categoryId, subcategoryId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        // 드래그가 끝났을 때 moveCategory 호출
        setTimeout(() => {
          moveSubsubCategory(item.id, index, categoryId, subcategoryId, true);
        });
      }
    },
  });

  const [, drop] = useDrop({
    accept: 'SUBSUBCATEGORY',
    hover: (item) => {
      if (item.index !== index) {
        moveSubsubCategory(item.id, index, categoryId, subcategoryId);
        item.index = index; // 업데이트된 인덱스를 반영
      }
    },
  });

  return (
    <Box ml={'3.5rem'} mb={'1.5rem'}>
      <HStack spacing={'0.75rem'} alignItems={'flex-start'}>
        <HStack spacing={'1.5rem'}>
          <Center w={'2rem'}>
            {!isDragging && <Img src={IconCategory.src} />}
          </Center>
          <Box
            ref={(node) => drag(drop(node))}
            cursor={isDragging ? 'grabbing' : 'grab'} // 드래그 중일 때 커서를 'grabbing'으로 설정
            opacity={isDragging ? 0.5 : 1}
            w={'41.25rem'}
            border={'1px solid #A7C3D2'}
            borderRadius={'0.25rem'}
            // py={'0.75rem'}
            px={'1rem'}
            bg={'#FFF'}
          >
            <HStack
              spacing={'1rem'}
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              <Box w={'36.75rem'} h={'3rem'}>
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
                    handleCategoryTitleChange(
                      e,
                      categoryId,
                      subcategoryId,
                      subsubcategory.id,
                    );
                  }}
                  value={subsubcategory.name || ''}
                  bg={'#FFF'}
                />
              </Box>
              <Center
                w={'1.5rem'}
                h={'1.5rem'}
                cursor={'pointer'}
                onClick={() =>
                  deleteSubsubCategory(
                    subsubcategory.id,
                    categoryId,
                    subcategoryId,
                  )
                }
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
        </HStack>

        <Box w={'11.5rem'} />
        <Box w={'11.5rem'}>
          {index === 0 && (
            <Button
              onClick={() => {
                addSubsubCategory(categoryId, subcategoryId);
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
                fontSize={'1rem'}
                fontWeight={400}
                lineHeight={'1.75rem'}
              >
                {localeText(LANGUAGES.CATEGORY.ADD_CATEGORY)}
              </Text>
            </Button>
          )}
        </Box>
      </HStack>
    </Box>
  );
};

export default SubSubCategory;
