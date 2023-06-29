import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { PropsWithChildren, useCallback, useEffect, useState } from "react";
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
  } from 'react-places-autocomplete';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import toast, { Toaster } from "react-hot-toast";
import Switch from "../../components/switch";
import { createNewContent, getContentById, updateContent } from "../../services/contentService";
import './content.scss';

interface Content {
    title: string,
    description: string,
    video: string
}

interface TabI {
    activeTab: number,
    fetchContent: () => void,
    setOpenWithHeader: React.Dispatch<React.SetStateAction<boolean>>,
    mode: string,
    contentId: string,
}

const containerStyle = {
    width: '100%',
    height: '200px'
};

const AddEditContent: React.FC<PropsWithChildren<TabI>> = ({ activeTab, fetchContent, setOpenWithHeader, mode, contentId }) => {

    const [file, setFile] = useState<File>();
    const [tag, setTag] = useState<string>('');
    const [tagList, setTagList] = useState<Array<{tag: string}>>([]);
    const [center,setCenter]= useState({
        lat: 39.952584, lng: -75.165221
    })
    const [showCurrentLocation, setShowCurrentLocation] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');
    console.log(file);
    const [contentData, setContentData] = useState<Content>({
        title: '',
        description: '',
        video: '',
    });
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyBcNWq7pVUi9n2C4JCVC8oSR2lX3l546ZQ"
    });

    const onLoad = useCallback(function callback(map: { fitBounds: (arg0: google.maps.LatLngBounds) => void; }) {
        const bounds = new window.google.maps.LatLngBounds();
        map?.fitBounds(bounds);
    }, []);

    const fetchContentDetails = async () => {
        const response = await getContentById(contentId);
        if (response && response.status) {
            setContentData({
                ...contentData,
                title: response?.data?.data?.details?.title,
                description: response?.data?.data?.details?.description,
            });
            setTagList(response?.data?.data?.details?.tag);
        }
    }

    useEffect(() => {
        fetchContentDetails();
    }, []);

    const getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(function(position) {
            setCenter({
                ...center,
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
        });
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.currentTarget;
        setContentData({
            ...contentData,
            [name]: value
        });
    }

    const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTag(e?.currentTarget.value);
    }

    const handleSearch = (address: string) => {
        setSearchText(address);
    }

    const handleSelect = (address: string) => {
        setSearchText(address);
        geocodeByAddress(address)
          .then(results => getLatLng(results[0]))
          .then(latLng => setCenter({
            ...center,
            lat: latLng.lat,
            lng: latLng.lng
          }))
          .catch(error => console.error('Error', error));
    };

    const addTag = () => {
        if (tag) {
            let tags = [];
            tags.push({
                tag: tag
            });
            setTagList(tags);
            setTag('');
        }
    }

    const renderTags = () => {
        if (tagList?.length > 0) {
            return tagList.map((tag, i) => {
                return (
                    <button key={i} type="button" className="tag_btn">{tag?.tag}</button>
                )
            })
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e?.currentTarget?.files?.[0]);
    }

    const onAddContent = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = {
            details: {
                title: contentData?.title,
                tag: tagList,
                description: contentData?.description,
            },
        }
        if (mode === 'add') {
            Object.assign(data, { type: activeTab === 1 ? 'message' : activeTab === 2 ? 'file' : 'page' });
            try {
                const response = await createNewContent(data);
                if (response && response.status) {
                    toast.success(response?.data?.message);
                    fetchContent();
                    setOpenWithHeader(false);
                }
            } catch (err) {
                toast.error('error while creating new content');
            }
        } else {
            try {
                const res = await updateContent(data, contentId);
                if (res && res.status) {
                    toast.success(res?.data?.message);
                    fetchContent();
                    setOpenWithHeader(false);
                }
            } catch (err) {
                toast.error('Error while updating content');
            }
        }
    }

    return (
        <form id="addContentForm" className="addcontent_form" onSubmit={(evt) => onAddContent(evt)}>
            <div className="form-container">
                <div className="form-group">
                    <label>Title</label>
                    <input
                        name='title'
                        className="form-control mt-1"
                        type="text"
                        placeholder="Enter title"
                        onChange={(val) => handleChange(val)}
                        value={contentData?.title}
                    />
                </div>
                <div className="form-group">
                    <h5>Tags</h5>
                    <div className="addtag_section">
                        <div className="addtag">
                            {renderTags()}
                        </div>
                        <div className="d-flex">
                            <input type="text" className="form-control" name="tag" value={tag || ''} onChange={(e) => handleTagChange(e)}/>
                            <button type="button" onClick={() => addTag()} className="addtag_btn"> + New Tag</button>
                        </div>
                    </div>
                </div>
                {(activeTab === 1 || activeTab === 3) && <div className="form-group mt-1">
                    <label>Description</label>
                    <textarea
                        name='description'
                        className="form-control mt-1"
                        placeholder="Enter your description"
                        onChange={(val) => handleChange(val)}
                        value={contentData?.description}
                    />
                </div>}
                {activeTab === 3 && <div className="form-group mt-1">
                    <label>YouTube Embedded Videos Urls</label>
                    <input
                        name='video'
                        className="form-control mt-1"
                        type="text"
                        placeholder="Add youtube video"
                        onChange={(val) => handleChange(val)}
                        value={contentData?.video}
                    />
                </div>}
                {activeTab === 3 && <div className="form-group mt-1">
                    <div className="form_sec">
                        <label>Add Map</label>
                        <PlacesAutocomplete
                        value={searchText}
                        onChange={(e) => handleSearch(e)}
                        onSelect={handleSelect}
                    >
                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                        <div className="auto_comp">
                            <input
                            {...getInputProps({
                                placeholder: 'Search Places ...',
                                className: 'location-search-input',
                            })}
                            className="form-control"
                            />
                            <div className="autocomplete-dropdown-container">
                            {loading && <div>Loading...</div>}
                            {suggestions.map(suggestion => {
                                const className = suggestion.active
                                ? 'suggestion-item--active'
                                : 'suggestion-item';
                                // inline style for demonstration purpose
                                const style = suggestion.active
                                ? { backgroundColor: '#ccc', cursor: 'pointer', border:'1px solid #000', padding:'5px' }
                                : { backgroundColor: '#ffffff', cursor: 'pointer', border:'1px solid #000', padding:'5px' };
                                return (
                                <div
                                    {...getSuggestionItemProps(suggestion, {
                                    className,
                                    style,
                                    })}
                                >
                                    <span>{suggestion.description}</span>
                                </div>
                                );
                            })}
                            </div>
                        </div>
                        )}
                    </PlacesAutocomplete>
                    </div>
                    
                    {/* <input
                        type='search'
                        id='search_input'
                        name='search'
                        value={searchText}
                        onChange={(e) => handleSearch(e)}
                        placeholder="Search for a custom point"
                        maxLength={100}
                        autoComplete='off'
                    /> */}
                    
                    <div className='location_select'>
                    <label>Current Location</label>
                        <div className="custom_switch">
                        <Switch checked={showCurrentLocation}
                        onChange={() => {setShowCurrentLocation(!showCurrentLocation); getCurrentLocation()}}
                        name="currentLocation" offstyle={''} onstyle={''} value={undefined} />
                        </div>

                    </div>
                    <div className="map_view">
                    {isLoaded ? (
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            zoom={5}
                            onLoad={onLoad}
                            center={center}
                            options={{
                                zoomControl: false,
                                fullscreenControl: false,
                                rotateControl: false,
                                streetViewControl: false,
                                mapTypeControl: false
                            }}
                        >
                            <Marker position={center} />
                        </GoogleMap>
                    ): <></>}
                    </div>
                </div>}
                {(activeTab === 2 || activeTab === 3) && <div className="image-upload mt-2">
                    <label htmlFor="file-input">
                        <FontAwesomeIcon icon={faUpload} color="#3da6f7" size="lg" />
                    </label>
                    <input
                        onChange={(evt) => handleImageUpload(evt)}
                        id="file-input"
                        type="file"
                        accept="image/*"
                    />
                </div>}
            </div>
            <div className='d-flex justify-content-center w-100'>
                <button type='submit' className="btn btn-dark login-btn m-2">
                    {mode === 'add' ? 'Add' : 'Update'} {activeTab === 1 ? 'message' : activeTab === 2 ? 'file' : 'page'}
                </button>
            </div>
            <Toaster />
        </form>
    )
}

export default AddEditContent;
