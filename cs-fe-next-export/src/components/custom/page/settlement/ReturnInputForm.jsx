'use client';

import ReturnInput from './ReturnInput';

const ReturnInputForm = ({
  listSettlement,
  setListSettlement,
  item,
  index,
}) => {
  const handleItemChange = (index, newAmount) => {
    const updatedData = [...listSettlement];
    const targetUpdateData = updatedData[index];

    // 주문 ID로 해당 아이템을 찾아 업데이트
    const itemIndex = targetUpdateData.items.findIndex(
      (targetItem) => targetItem.ordersId === item.ordersId,
    );

    if (itemIndex !== -1) {
      const updatedItem = { ...targetUpdateData.items[itemIndex] };

      // 아이템의 settlementAmount를 업데이트
      updatedItem.settlementAmount =
        Number(updatedItem.settlementAmount) - Number(newAmount || 0);

      // 수정된 아이템을 배열에 반영
      targetUpdateData.items[itemIndex] = updatedItem;

      // 상위 객체의 settlementAmount를 재계산
      const updatedSettlementAmount = targetUpdateData.items.reduce(
        (acc, item) => acc + item.settlementAmount,
        0,
      );
      targetUpdateData.settlementAmount = updatedSettlementAmount;

      // 상태 업데이트
      setListSettlement(updatedData);
    }
  };

  return (
    <ReturnInput
      item={item}
      onChange={(value) => handleItemChange(index, value)}
    />
  );
};

export default ReturnInputForm;
