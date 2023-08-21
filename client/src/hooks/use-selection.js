import { useCallback, useEffect, useState } from 'react';

export const useSelection = (items = []) => {
  const [selected, setSelected] = useState([]);
  const [deselected, setDeselected] = useState([]);

  useEffect(() => {
    setSelected([]);
  }, [items]);

  const handleSelectAll = useCallback(() => {
    setSelected([...items]);
  }, [items]);

  const handleSelectOne = useCallback((item) => {
    setSelected((prevState) => [...prevState, item]);
    setDeselected((prevState) => {
      return prevState.filter((_item) => _item !== item);
    });
  }, []);

  const handleDeselectAll = useCallback(() => {
    setSelected([]);
  }, []);

  const handleDeselectOne = useCallback((item) => {
    setSelected((prevState) => {
      return prevState.filter((_item) => _item !== item);
    });
    setDeselected(prevState => [...prevState, item]);
  }, []);

  return {
    handleDeselectAll,
    handleDeselectOne,
    handleSelectAll,
    handleSelectOne,
    selected,
    deselected
  };
};
