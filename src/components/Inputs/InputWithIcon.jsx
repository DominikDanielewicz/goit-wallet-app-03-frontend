import styled from 'styled-components';
import { BaseInput } from './BaseInput';
import { Icon } from '../Icon/Icon';

const StyledDiv = styled.div`
  display: inline-block;
  position: relative;

  ${BaseInput} {
    padding-left: 47px;
  }
`;

const InputWithIconBase = ({ className, name, icon, placeholder, onChange, type }) => {
  return (
    <StyledDiv>
      <BaseInput
        className={className}
        placeholder={placeholder}
        name={name}
        onChange={onChange}
        type={type}
      />

      <Icon icon={icon} />
    </StyledDiv>
  );
};

export const InputWithIcon = styled(InputWithIconBase)``;
