import { Cotizacion } from "@flux/stores/useGlobalStore";
import { useState } from "react";
import ModalOptions from "@components/Modals/ModalOptions";
import CustomText from "@components/CustomText/CustomText";
import { Pressable, FlatList, View } from "react-native";
import { CotizacionCard } from "./CotizacionCard";

export const CotizacionInfoSelector = ({ onClose, visible, cotizaciones }: { onClose: () => void; visible: boolean; cotizaciones: Cotizacion[] }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const noResponsability = `Las tasas de cambio mostradas en la aplicación para criptoactivos se basan en los precios actuales del mercado. \n\nEstos precios son inherentemente volátiles y pueden cambiar rápidamente debido a factores fuera de nuestro control. \n\nWheek no fija, controla ni garantiza estas tasas. Al utilizar nuestros servicios, usted reconoce y acepta que Wheek no se hace responsable de ninguna pérdida o variación en el valor que pueda surgir de las fluctuaciones del mercado.`;
  
  return (
    <ModalOptions visible={visible} onClose={onClose}>
      <CustomText style={{ fontSize: 15 }}>
        Cotizaciones del <CustomText style={{ color: 'rgb(170, 125, 241)' }}>día</CustomText>
      </CustomText>
      <Pressable onPress={() => setIsExpanded(!isExpanded)}>
        <CustomText style={{ fontSize: 12, marginBottom: 10, color: 'rgb(129, 129, 129)' }}>
          {isExpanded ? (
            noResponsability + ' ...Ver menos'
          ) : (
            noResponsability.slice(0, 100) + '... Ver más'
          )}
        </CustomText>
      </Pressable>

      <FlatList
        data={cotizaciones}
        renderItem={({ item }) => <CotizacionCard cotizacion={item} />}
        keyExtractor={(item) => item.fuente}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 10 }}
      />
    </ModalOptions>
  );
};