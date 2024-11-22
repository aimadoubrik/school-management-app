import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchsecteurs } from '../../features/secteur/secteurslice';
import SecteursTable from './components/SecteursTable';

const SecteursPage = () => {
  const dispatch = useDispatch();
  const secteurs = useSelector((state) => state.secteur.secteurs);
  const loading = useSelector((state) => state.secteur.loading);
  const error = useSelector((state) => state.secteur.error);

  useEffect(() => {
    dispatch(fetchsecteurs());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="font-extrabold text-blue-950 mb-6">Gestion des Secteurs</h1>
      <SecteursTable secteurs={secteurs} />
    </div>
  );
};

export default SecteursPage;
