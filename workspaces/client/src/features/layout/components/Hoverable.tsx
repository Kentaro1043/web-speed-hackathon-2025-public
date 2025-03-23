import classNames from 'classnames';
import { Children, cloneElement, ReactElement, Ref, useCallback, useRef } from 'react';

import { usePointer } from '@wsh-2025/client/src/features/layout/hooks/usePointer';

interface Props {
  children: ReactElement<{ className?: string; ref?: Ref<unknown> }>;
  classNames: {
    default?: string;
    hovered?: string;
  };
}

// カスタムのuseMergeRefs実装
function useMergeRefs<T>(refs: Array<Ref<T> | null | undefined>): Ref<T> {
  return useCallback((value: T) => {
    refs.forEach((ref) => {
      if (!ref) return;
      
      if (typeof ref === 'function') {
        ref(value);
      } else {
        (ref as React.MutableRefObject<T>).current = value;
      }
    });
  }, [refs]);
}

export const Hoverable = (props: Props) => {
  const child = Children.only(props.children);
  const elementRef = useRef<HTMLDivElement>(null);

  const mergedRef = useMergeRefs([elementRef, child.props.ref]);

  const pointer = usePointer();
  const elementRect = elementRef.current?.getBoundingClientRect();

  const hovered =
    elementRect != null &&
    elementRect.left <= pointer.x &&
    pointer.x <= elementRect.right &&
    elementRect.top <= pointer.y &&
    pointer.y <= elementRect.bottom;

  return cloneElement(child, {
    className: classNames(
      child.props.className,
      'cursor-pointer',
      hovered ? props.classNames.hovered : props.classNames.default,
    ),
    ref: mergedRef,
  });
};
