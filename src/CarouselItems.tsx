import * as React from "react";

import {
  CarouselInternalState,
  CarouselProps,
  SkipCallbackOptions
} from "./types";
import { getInitialState, getIfSlideIsVisbile } from "./utils";

interface CarouselItemsProps {
  props: CarouselProps;
  state: CarouselInternalState;
  clones: any[];
  notEnoughChildren: boolean;
  goToSlide: (index: number, skipCallbacks?: SkipCallbackOptions) => void;
}

const CarouselItems = ({
  props,
  state,
  goToSlide,
  clones,
  notEnoughChildren
}: CarouselItemsProps) => {
  const { itemWidth } = state;
  const {
    children,
    infinite,
    itemClass,
    itemAriaLabel,
    partialVisbile,
    partialVisible,
    itemRole
  } = props;
  const {
    flexBisis,
    shouldRenderOnSSR,
    domFullyLoaded,
    partialVisibilityGutter,
    shouldRenderAtAll
  } = getInitialState(state, props);
  if (!shouldRenderAtAll) {
    return null;
  }
  if (partialVisbile) {
    console.warn(
      'WARNING: Please correct props name: "partialVisible" as old typo will be removed in future versions!'
    );
  }

  return (
    <>
      {(infinite ? clones : React.Children.toArray(children)).map(
        (child, index) => {
          // get certain aria props from child
          const { ariaLabel, ariaSelected, ...childProps } = child.props;

          const ariaHidden = getIfSlideIsVisbile(index, state);
          return (
            <li
              key={index}
              role={itemRole}
              data-index={index}
              onClick={() => {
                if (props.focusOnSelect) {
                  goToSlide(index);
                }
              }}
              aria-hidden={ariaHidden}
              tabIndex={ariaHidden ? -1 : 0}
              aria-selected={ariaSelected}
              aria-label={
                itemAriaLabel ? itemAriaLabel : ariaLabel ? ariaLabel : null
              }
              style={{
                flex: shouldRenderOnSSR ? `1 0 ${flexBisis}%` : "auto",
                position: "relative",
                width: domFullyLoaded
                  ? `${
                      // old wrongly spelt partialVisbile prop kept to not make changes breaking
                      (partialVisbile || partialVisible) &&
                      partialVisibilityGutter &&
                      !notEnoughChildren
                        ? itemWidth - partialVisibilityGutter
                        : itemWidth
                    }px`
                  : "auto"
              }}
              className={`react-multi-carousel-item ${
                getIfSlideIsVisbile(index, state)
                  ? "react-multi-carousel-item--active"
                  : ""
              } ${itemClass}`}
            >
              {React.cloneElement(child, childProps)}
            </li>
          );
        }
      )}
    </>
  );
};

export default CarouselItems;
