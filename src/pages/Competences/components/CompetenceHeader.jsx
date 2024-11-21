import { TableHeader } from '../../../components';
import { RefreshCcw, Plus, Download } from 'lucide-react';
import PropTypes from 'prop-types';

const CompetenceHeader = ({ onRefresh, onExport, onAdd }) => {
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

  return <TableHeader title="Elements de compétence" actions={actions} />;
};

CompetenceHeader.propTypes = {
  onRefresh: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default CompetenceHeader;
