import { Component, useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface FoodEntity {
  id: number,
  name: string,
  description: string,
  price: string,
  available: boolean,
  image: string
}

const Dashboard = function() {

  const [foods, setFoods] = useState<FoodEntity[]>([] as FoodEntity[]);
  const [editingFood, setEditingFood] = useState<FoodEntity>({} as FoodEntity);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

  useEffect(() => {
    async function requestData() {
      const response = await api.get('/foods');
      setFoods(response.data);
    }

    requestData();
  }, []);


  async function handleAddFood(food: FoodEntity) {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      var updatedFoods = [...foods, response.data];

      setFoods(updatedFoods);

    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: FoodEntity) {
    try{
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );
      
      setFoods(foodsUpdated);

    }catch(err){
      console.log(err);
    }
  }


  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toggleModal() {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: FoodEntity) {
    setEditingFood(food);
    setEditModalOpen(true);
  }


  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={() => toggleModal()}
        handleAddFood={(data) => handleAddFood(data)}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={() => toggleEditModal()}
        editingFood={editingFood}
        handleUpdateFood={(data) => handleUpdateFood(data)}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={(data) => handleDeleteFood(data)}
              handleEditFood={(data) => handleEditFood(data)}
            />
          ))}
      </FoodsContainer>
    </>
  );
  
};

export default Dashboard;
