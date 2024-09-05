'use client';
import Image from 'next/image';
import {
  Wrapper,
  Inner,
  Header,
  Offers,
  OfferCard,
  ImageCtn,
  TextCtn,
} from './styles';
import MaskText from '@/components/Common/MaskText';
import { useIsMobile } from '../../../../libs/useIsMobile';
import {
  desktopHeaderPhrases,
  desktopParagraphPhrase,
  mobileParagraphPhrase,
} from './constants';

const OffersSection = () => {
  const isMobile = useIsMobile();
  return (
    <Wrapper>
      <Inner>
        <Header>
          <MaskText phrases={desktopHeaderPhrases} tag="h1" />

          {isMobile ? (
            <MaskText phrases={mobileParagraphPhrase} tag="p" />
          ) : (
            <MaskText phrases={desktopParagraphPhrase} tag="p" />
          )}
        </Header>
       
       
      </Inner>
    </Wrapper>
  );
};

export default OffersSection;
