import styled from "styled-components";

const baseStyles = {
  button: `
    font-semibold
    border-4
    border-transparent
    rounded-full
    py-2
    px-4
  `,
  animation: `
    transition
    ease-in-out
    duration-200`,
};

export const Wrapper = styled.section.attrs({
  className: `relative`,
})``;

export const Container = styled.div.attrs({
  className: `
    px-20
    bg-cover
    bg-center`,
})``;

export const Link = styled.a.attrs({
  className: `
    text-base
    font-semibold
    ml-10
    text-current
    hover:text-orange-500
    transition
    ease-in-out
    duration-200`,
})``;

export const Btn = {
  Primary: styled.button.attrs({
    className: `
      ${baseStyles.button}
      ${baseStyles.animation}
      bg-orange-600
      hover:bg-orange-700
      text-white`,
  })``,

  Secondary: styled.button.attrs({
    className: `
      ${baseStyles.button}
      ${baseStyles.animation}
      border-2
      border-orange-700
      bg-transparent
      text-white
      hover:text-orange-700`,
  })``,
};

export const Row = styled.div.attrs({
  className: `
    flex
    flex-row
    items-center`,
})``;

export const Col = styled.div.attrs({
  className: `
    flex
    flex-col`,
})``;
