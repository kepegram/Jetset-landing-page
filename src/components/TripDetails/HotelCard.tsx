import { View, Text, Image, Pressable, Modal } from "react-native";
import React, { useEffect, useState } from "react";
import { GetPhotoRef } from "../../api/googlePlaceApi";
import { useTheme } from "../../context/themeContext";
import MapView, { Marker } from "react-native-maps";
import { MainButton } from "../ui/button";

// Define the interface for the 'item' prop
interface HotelCardProps {
  item: {
    hotelName: string;
    rating: number;
    price: number;
    geoCoordinates: {
      latitude: number;
      longitude: number;
    };
  };
}

const HotelCard: React.FC<HotelCardProps> = ({ item }) => {
  const { currentTheme } = useTheme();
  const [photoRef, setPhotoRef] = useState<string | undefined>();
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    GetGooglePhotoRef();
  }, []);

  const GetGooglePhotoRef = async () => {
    const result = await GetPhotoRef(item.hotelName);
    setPhotoRef(result);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <>
      <Pressable onPress={toggleModal}>
        <View
          style={{
            marginRight: 20,
            width: 180,
            backgroundColor: currentTheme.accentBackground,
            borderRadius: 15,
            overflow: "hidden",
          }}
        >
          <Image
            source={{
              uri: photoRef
                ? "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=" +
                  photoRef +
                  "&key=" +
                  process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY
                : require("../../assets/place-placeholder.jpg"),
            }}
            style={{
              width: 180,
              height: 120,
            }}
          />
          <View
            style={{
              padding: 5,
            }}
          >
            <Text
              style={{
                fontFamily: "outfit-medium",
                fontSize: 17,
                color: currentTheme.textPrimary,
              }}
              numberOfLines={1}
            >
              {item.hotelName}
            </Text>

            <View
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontFamily: "outfit",
                  color: currentTheme.textSecondary,
                }}
              >
                Rating: {item.rating} ⭐
              </Text>
              <Text
                style={{
                  fontFamily: "outfit",
                  color: currentTheme.textSecondary,
                }}
              >
                Price: ${item.price}/night
              </Text>
            </View>
          </View>
        </View>
      </Pressable>

      <Modal visible={isModalVisible} onRequestClose={toggleModal}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: item.geoCoordinates.latitude,
            longitude: item.geoCoordinates.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: item.geoCoordinates.latitude,
              longitude: item.geoCoordinates.longitude,
            }}
            title={item.hotelName}
          />
        </MapView>
        <MainButton
          buttonText="Close Map"
          width="auto"
          onPress={toggleModal}
          style={{
            position: "absolute",
            top: 50,
            right: 20,
            backgroundColor: currentTheme.alternate,
            padding: 10,
            borderRadius: 5,
          }}
        />
      </Modal>
    </>
  );
};

export default HotelCard;
