
export const textTags = ['h1', 'h2']
const allowedTags = [...textTags, 'form'];

const letsMutate:any = ({ xpath, tagType, value, jpeg_path }) => {
    let props:any = {
        xpath,
        jpeg_path,
        tagType
    };
    if (textTags.includes(tagType)) props.change = {
        property_level_1: "innerHTML",
        property_level_2: null,
        value
    }
    if (tagType === 'form') props.event = {
        "name": "submit",
        "fallback_name": "onsubmit",
        "execute_converted": true,
        "custom_callback": null
    }

    return props;
    
}

export const mutateAIResponse = ({gpt3_text, conversion_elements}) => {
  
    const conversions = conversion_elements.filter(v => allowedTags.includes(v.tagType));
    const compiledConversions = conversions.map(letsMutate);

    const gpt3 = gpt3_text.filter(v => allowedTags.includes(v.tagType));
    
    const gpt3_compiled = gpt3.reduce((_store, { options, originalText, ...params }) => {
      
      const mapped = [originalText, ...options].map((value, index) => {
        const getMutated = letsMutate({...params, value});
        return [getMutated, ...compiledConversions];
      })
      _store = [..._store, ...mapped];
      return _store;
    }, [])
    return gpt3_compiled;
}
