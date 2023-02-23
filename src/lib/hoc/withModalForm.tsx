import { useEffect, cloneElement, useState } from 'react';
import type { ModalFormProps } from '@ant-design/pro-components';
import { useModal } from '../hooks';

const withModalForm = <T,>(Component: any, modalName: string) => {
  function ComponentWithProp({
    trigger,
    modalProps,
    ...rest
  }: T & ModalFormProps) {
    const { open, openModal, closeModal } = useModal(modalName);
    const [isMount, setIsMount] = useState(false);

    useEffect(() => {
      if (open) {
        console.log(open);
        setIsMount(true);
      }
    }, [open]);

    const handleAfterClose = () => {
      setIsMount(false);
    };

    const handleOpen = () => {
      setIsMount(true);
      openModal(modalName);
    };

    const handleOpenChange = (open: boolean) => {
      if (!open) {
        closeModal(modalName);
      }
    };

    return (
      <>
        {trigger &&
          cloneElement(trigger, {
            ...trigger.props,
            onClick: handleOpen,
          })}

        {isMount && (
          <Component
            open={open}
            modalProps={{
              ...modalProps,
              afterClose: handleAfterClose,
            }}
            onOpenChange={handleOpenChange}
            {...rest}
          />
        )}
      </>
    );
  }

  return ComponentWithProp;
};

export default withModalForm;
