import classNames from 'classnames';

import './CardsDeck.css';

export type CardsDeckProps = {
  size: number;
  cards?: number[];
  displayed?: boolean;
  hideCards?: () => void | Promise<void>;
};

export const CardsDeck = ({ size, cards, displayed = false }: CardsDeckProps) => {
  let faces: number[] = new Array(size).fill(2); // neutral
  if (cards) {
    faces = faces.map((_, i) => {
      if (i < cards[0]) {
        return 0;
      } else if (i < cards[0] + cards[1]) {
        return 1;
      }
      return 2;
    });
  }
  const cardsElement = new Array(size).fill(null).map((_, i) => {
    return (
      <div className="CardsDeck_cardContainer" key={`${i}-${faces[i]}`}>
        <div
          className={classNames('CardsDeck__card', {
            CardsDeck__displayed: displayed,
            CardsDeck__wire: faces[i] === 0,
            CardsDeck__bomb: faces[i] === 1,
            CardsDeck__neutral: faces[i] === 2,
          })}
        ></div>
      </div>
    );
  });
  return <div className="CardsDeck">{cardsElement}</div>;
};
