import type { IPageBlock } from '@/types/page-block';
import { EBlockType } from '@/types/page-block';
import {
  isMediaBlockType,
  isQuestionBlockType,
  isTextBlockType,
} from '../../utils/block-helpers';
import { useBuilder } from '../../context/builder-context';
import { BlockWrapper } from './block-wrapper';
import { MediaBlock } from './media-block';
import { QuestionBlock } from './question-block';
import { RelatedLessonsBlock } from './related-lessons-block';
import { ResourcesBlock } from './resources-block';
import { TextBlock } from './text-block';

interface IBlockRendererProps {
  block: IPageBlock;
  index: number;
  total: number;
}

export const BlockRenderer: React.FC<IBlockRendererProps> = ({
  block,
  index,
  total,
}) => {
  const {
    activeBlockId,
    isTeacherView,
    setActiveBlockId,
    updateBlock,
    deleteBlock,
    duplicateBlock,
    reorderBlocks,
    getBlocks,
    selectedPageId,
  } = useBuilder();

  const renderContent = () => {
    if (isTextBlockType(block.type)) {
      return (
        <TextBlock block={block} isTeacherView={isTeacherView} onChange={updateBlock} />
      );
    }
    if (isMediaBlockType(block.type)) {
      return (
        <MediaBlock block={block} isTeacherView={isTeacherView} onChange={updateBlock} />
      );
    }
    if (isQuestionBlockType(block.type)) {
      return (
        <QuestionBlock block={block} isTeacherView={isTeacherView} onChange={updateBlock} />
      );
    }
    if (block.type === EBlockType.LinkToPage) {
      return (
        <RelatedLessonsBlock
          block={block}
          isTeacherView={isTeacherView}
          onChange={updateBlock}
        />
      );
    }
    if (
      block.type === EBlockType.ExternalLink ||
      block.type === EBlockType.Attachment ||
      block.type === EBlockType.Pdf
    ) {
      return (
        <ResourcesBlock block={block} isTeacherView={isTeacherView} onChange={updateBlock} />
      );
    }
    return (
      <TextBlock block={block} isTeacherView={isTeacherView} onChange={updateBlock} />
    );
  };

  const move = (direction: -1 | 1) => {
    if (!selectedPageId) return;
    const blocks = getBlocks(selectedPageId);
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    const next = [...blocks];
    const [removed] = next.splice(index, 1);
    next.splice(targetIndex, 0, removed!);
    reorderBlocks(next);
  };

  return (
    <BlockWrapper
      isActive={activeBlockId === block.id}
      isTeacherView={isTeacherView}
      onSelect={() => setActiveBlockId(block.id)}
      onDelete={() => deleteBlock(block.id)}
      onDuplicate={() => duplicateBlock(block.id)}
      onMoveUp={() => move(-1)}
      onMoveDown={() => move(1)}
      canMoveUp={index > 0}
      canMoveDown={index < total - 1}
    >
      {renderContent()}
    </BlockWrapper>
  );
};
