export const channelCategories: Record<string, string> = {
    hi: "Hindi",
    en: "English",
    ent: "Entertainment",
    int: "International",
    pu: "Punjabi",
    re: "Regional",
    ba: "Bangla"
};




type ChannelKey = keyof typeof channelCategories;

export const getCategory = (key: ChannelKey): string  => {
    return channelCategories[key];
}

export const getKeyByValue = (value: string): string => {
    return Object.keys(channelCategories).find(key => channelCategories[key] === value) || "";
};

