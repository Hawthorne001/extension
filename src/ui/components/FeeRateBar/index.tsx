import { CSSProperties, useEffect, useState } from 'react';

import { colors } from '@/ui/theme/colors';
import { useWallet } from '@/ui/utils';

import { Column } from '../Column';
import { Input } from '../Input';
import { Row } from '../Row';
import { Text } from '../Text';

enum FeeRateType {
  SLOW,
  AVG,
  FAST,
  CUSTOM
}

export function FeeRateBar({ onChange }: { onChange: (val: number) => void }) {
  const wallet = useWallet();
  const [feeOptions, setFeeOptions] = useState<{ title: string; desc?: string; feeRate?: number }[]>([]);

  useEffect(() => {
    wallet.getFeeSummary().then((v) => {
      setFeeOptions([...v.list, { title: 'Custom' }]);
    });
  }, []);

  const [feeOptionIndex, setFeeOptionIndex] = useState(FeeRateType.AVG);
  const [feeRateInputVal, setFeeRateInputVal] = useState('');

  useEffect(() => {
    let val = 5;
    if (feeOptionIndex === FeeRateType.CUSTOM) {
      val = parseFloat(feeRateInputVal) || 5;
    } else if (feeOptions.length > 0) {
      val = feeOptions[feeOptionIndex].feeRate || 5;
    }
    onChange(val);
  }, [feeOptions, feeOptionIndex, feeRateInputVal]);

  return (
    <Column>
      <Row justifyCenter>
        {feeOptions.map((v, index) => {
          const selected = index === feeOptionIndex;
          return (
            <div
              key={v.title}
              onClick={() => {
                setFeeOptionIndex(index);
              }}
              style={Object.assign(
                {},
                {
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.3)',
                  height: 75,
                  width: 75,
                  textAlign: 'center',
                  padding: 4,
                  borderRadius: 5,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  cursor: 'pointer'
                } as CSSProperties,
                selected ? { backgroundColor: colors.primary } : {}
              )}>
              <Text text={v.title} textCenter style={{ color: selected ? colors.black : colors.white }} />
              {v.feeRate && (
                <Text
                  text={`${v.feeRate} sat/vB`}
                  size="xxs"
                  textCenter
                  style={{ color: selected ? colors.black : colors.white }}
                />
              )}
              {v.desc && (
                <Text
                  text={`${v.desc}`}
                  size="xxs"
                  textCenter
                  style={{ color: selected ? colors.black : colors.white_muted }}
                />
              )}
            </div>
          );
        })}
      </Row>
      {feeOptionIndex === FeeRateType.CUSTOM && (
        <Input
          preset="amount"
          placeholder={'sat/vB'}
          defaultValue={feeRateInputVal}
          value={feeRateInputVal}
          onChange={async (e) => {
            const val = e.target.value + '';
            setFeeRateInputVal(val);
          }}
          onBlur={() => {
            const val = parseInt(feeRateInputVal) + '';
            setFeeRateInputVal(val);
          }}
          autoFocus={true}
        />
      )}
    </Column>
  );
}