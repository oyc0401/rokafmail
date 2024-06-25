import { sqlinjectionFilter } from './sqliFilter';
import { xssFilter } from './xssFilter';
import { ValidateError } from '../validate';

export function filter(dirtyMessage: string) {

  const cleanHTML = xssFilter(dirtyMessage);
  const cleanSQL = sqlinjectionFilter(cleanHTML);

  return cleanSQL;
}


export function validateAttack(str: string) {
  const filteredString = filter(str);

  const valid = str == filteredString;

  if (!valid) {
    throw new ValidateError("편지 내용에서 보안 위협이 감지되었습니다. 추가적인 시도가 발생할 경우 군 보안 법령에 따라 법적 책임을 물을 수 있습니다.");
  }

}