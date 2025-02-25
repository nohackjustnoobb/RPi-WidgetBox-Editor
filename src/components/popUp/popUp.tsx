import './popUp.scss';

import {
  Component,
  ComponentType,
} from 'preact';
import { StyleTransition } from 'preact-transitioning';

export interface PopUpProps {
  close: () => void;
  show: boolean;
}

const usePopUp = <P extends PopUpProps>(
  WrappedComponent: ComponentType<P>,
  className: string
) =>
  class PopUp extends Component<P> {
    render({ show, close }: P) {
      return (
        <StyleTransition
          in={show}
          duration={250}
          styles={{
            enter: { opacity: 0 },
            enterActive: { opacity: 1 },
            exit: { opacity: 1 },
            exitActive: { opacity: 0 },
          }}
        >
          <div class="pop-up">
            <div class="background" onClick={close} />
            <div class={`container ${className}`}>
              <WrappedComponent {...(this.props as P)} />
            </div>
          </div>
        </StyleTransition>
      );
    }
  };

export default usePopUp;
