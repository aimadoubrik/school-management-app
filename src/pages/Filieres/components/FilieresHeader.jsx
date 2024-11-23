import { TableHeader } from '../../../components';
import { RefreshCcw, Plus, Download } from 'lucide-react';
import PropTypes from 'prop-types';

const FilieresHeader = ({ onRefresh, onExport, onAdd }) => {
  const actions = [
    {
      icon: RefreshCcw,
      onClick: onRefresh,
      className: 'btn btn-ghost btn-sm tooltip',
      tooltip: 'Rafraîchir',
    },
    {
      icon: Download,
      label: 'Export CSV',
      onClick: onExport,
      className: 'btn btn-outline btn-primary btn-sm gap-2',
    },
    {
      icon: Plus,
      label: 'Nouvelle Filière',
      onClick: onAdd,
      className: 'btn btn-primary btn-sm gap-2',
    },
  ];

  return <TableHeader title="Gestion des Filières" actions={actions} />;
};

FilieresHeader.propTypes = {
  onRefresh: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default FilieresHeader;
