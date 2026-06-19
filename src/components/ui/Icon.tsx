import type { ComponentType } from 'react'
import type { IconProps as PhosphorIconProps } from '@phosphor-icons/react'
import {
  Plus,
  Playlist,
  CaretDown,
  List,
  Check,
  Minus,
  X,
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  ArrowCounterClockwise,
  Pause,
  Play,
  Image,
  Leaf,
  Plant,
  Tree,
} from '@phosphor-icons/react'

const ICON_MAP: Record<IconName, ComponentType<PhosphorIconProps>> = {
  'Plus': Plus,
  'Playlist': Playlist,
  'Caret Down': CaretDown,
  'List': List,
  'Checkmark': Check,
  'Minus': Minus,
  'X': X,
  'Arrow Left': ArrowLeft,
  'Arrow Right': ArrowRight,
  'Arrow Down': ArrowDown,
  'Arrow Counter Clockwise': ArrowCounterClockwise,
  'Pause': Pause,
  'Play': Play,
  'Image': Image,
  'Leaf': Leaf,
  'Plant': Plant,
  'Tree': Tree,
}

export type IconName =
  | 'Plus'
  | 'Playlist'
  | 'Caret Down'
  | 'List'
  | 'Checkmark'
  | 'Minus'
  | 'X'
  | 'Arrow Left'
  | 'Arrow Right'
  | 'Arrow Down'
  | 'Arrow Counter Clockwise'
  | 'Pause'
  | 'Play'
  | 'Image'
  | 'Leaf'
  | 'Plant'
  | 'Tree'

interface IconProps {
  icon: IconName
  size?: number
  className?: string
  weight?: PhosphorIconProps['weight']
}

export default function Icon({ icon, size = 24, className, weight = 'bold' }: IconProps) {
  const Component = ICON_MAP[icon]
  return <Component size={size} className={`shrink-0 ${className ?? ''}`} weight={weight} />
}