import { StyleSheet } from 'react-native'
import React, { useState, createContext, useContext, ReactNode } from 'react'
import { Incubator, Assets, Text, View, Colors, Button } from 'react-native-ui-lib';

const { Toast } = Incubator;

const TOAST_ACTIONS = {
    none: {},
    label: { label: 'Undo', onPress: () => console.warn('undo') },
    // icon: { iconSource: Assets.icons.demo.plus, onPress: () => console.warn('add') }
};

type Prop = {
    showToast: boolean,
    setShowToast: (arg: boolean) => void,
    message: string,
    preset: "general" | "success" | "failure" | "offline"
}

const CustomToast = ({ showToast, setShowToast, message, preset }:  Prop) => {
    const [toastPosition, setToastPosition] = useState<'bottom' | 'top'>('bottom');
    const [isCustomContent, setIsCustomContent] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [selectedAction, setSelectedAction] = useState<keyof typeof TOAST_ACTIONS>('none');
    const [hasAttachment, setHasAttachment] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState<Incubator.ToastProps['preset']>(preset);
    const [isSwipeable, setIsSwipeable] = useState(true);

    return (
        <Toast
            key={`${toastPosition}-${isCustomContent}-${hasAttachment}`}
            visible={showToast}
            position={toastPosition}
            message={message}
            showLoader={showLoader}
            // renderAttachment={renderAttachment}
            preset={selectedPreset}
            swipeable={isSwipeable}
            onDismiss={() => setShowToast(!showToast)}
            autoDismiss={3500}
        // backgroundColor={Colors.$backgroundSuccessLight}
        // icon={Assets.icons.demo.add}
        // iconColor={Colors.$backgroundSuccessHeavy}
        // style={{borderWidth: 1, borderColor: Colors.$outlineDisabled}}
        // messageStyle={Typography.text80BO}
        />
    )

}

export default CustomToast;

export type ToastContextType = {
    displayToast: (message: string, preset: "general" | "success" | "failure" | "offline") => void;
}; 

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastContextProvider = ({ children }: { children: ReactNode }) => {
    const [showToast, setShowToast] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [preset, setPreset] = useState<"general" | "success" | "failure" | "offline">("general");

    const displayToast = (message: string, preset: "general" | "success" | "failure" | "offline") => {
        setMessage(message)
        setPreset(preset)
        setShowToast(true)
    }

    return (
        <ToastContext.Provider value={{ displayToast }}>
            {children}
            {showToast && <CustomToast
                setShowToast={setShowToast}
                showToast={showToast}
                message={message}
                preset={preset}
            />}
        </ToastContext.Provider>
    );
};

const styles = StyleSheet.create({

});