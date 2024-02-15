import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';

type Prop = {
    caption: string,
    style: object
}

const CustomText = ({ caption, style }: Prop) => {
    const [showMore, setShowMore] = useState<boolean>(false);
    const [showText, setShowText] = useState<boolean>(false);
    const [numOfLines, setNumOfLines] = useState<number | undefined>(undefined);

    const handleTextLayout = useCallback(
        (e) => {
            if (e.nativeEvent.lines.length > 2 && !showText) {
                setShowMore(true)
                setNumOfLines(2)
            }
        },
        [showText]
    );

    useEffect(() => {
        if (showMore) {
            setNumOfLines(showText ? undefined : 2);
        }
    }, [showText, showMore]);

    return (
        <View>
            <Text style={style} numberOfLines={numOfLines} onTextLayout={handleTextLayout}>
                {caption}
            </Text>

            {showMore ?
                <TouchableOpacity onPress={() => setShowText((showText) => !showText)}>
                    <Text style={styles.showMoreButtom}>{showText ? 'see less' : 'see more'}</Text>
                </TouchableOpacity>
                : null}
        </View>
    )
}

export default CustomText

const styles = StyleSheet.create({
    showMoreButtom: {
        color: 'grey'
    }
})