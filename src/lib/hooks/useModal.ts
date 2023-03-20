import { useModel } from '@umijs/max';

const useModal = <T>(name?: string) => {
  const modelUpdater = (model: any) => {
    if (!name) {
      return {
        openModal: model.openModal,
        closeModal: model.closeModal,
      };
    }

    return {
      open: model[name]?.open || false,
      params: (model[name]?.params || {}) as T,
      closeModal: model.closeModal,
      openModal: model.openModal,
    };
  };

  return useModel('modals', modelUpdater);
};

export default useModal;
