import { cloneElement, useState } from 'react';
import type { ModalFormProps } from '@ant-design/pro-components';

const withModalForm = <T,>(Component: any) => {
  function ComponentWithProp({
    trigger,
    modalProps,
    ...rest
  }: T & ModalFormProps) {
    const [open, setOpen] = useState(false);
    const [isMount, setIsMount] = useState(true);

    const handleAfterClose = () => {
      setIsMount(false);
    };

    const handleOpen = () => {
      setIsMount(true);
      setOpen(true);
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
            onOpenChange={setOpen}
            {...rest}
          />
        )}
      </>
    );
  }

  return ComponentWithProp;
};

export default withModalForm;
