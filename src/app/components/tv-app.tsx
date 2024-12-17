'use client'

import { useState, useCallback, useEffect } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { PlayCircle, ChevronLeft, ChevronRight, User } from 'lucide-react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import logoImg from "../../../public/logo.svg";
import playstoreIcon from "../../image/playstore.svg";
import axios from 'axios';
import { Menu, X } from 'lucide-react';
import LiveVideoPlayer from './VideoPlayer';
import Link from 'next/link';
import Shimmer from "./Shimmer";
import { getCategory, getKeyByValue } from "../components/utilies/channelCategories";
import emitter from './utilies/eventEmitter';
import { notFound } from 'next/navigation';
import { useMetadata } from './utilies/MetadataContext';

export default function TVApp() {
    const homeUrl = '/';
    const playstore = 'https://play.google.com/store/apps/details?id=com.neotv.app';
    const [canScrollPrev, setCanScrollPrev] = useState(false)
    const [canScrollNext, setCanScrollNext] = useState(true)
    const channelChanged = false;
    const [emblaRef, emblaApi] = useEmblaCarousel({ slidesToScroll: 4, align: 'start' })
    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])
    const onSelect = useCallback(() => {
        if (!emblaApi) return
        setCanScrollPrev(emblaApi.canScrollPrev())
        setCanScrollNext(emblaApi.canScrollNext())
    }, [emblaApi])

    const [currentVideo, setCurrentVideo] = useState('')
    const [currentChannelId, setCurrentChannelId] = useState('')
    const [currentChannel, setCurrentChannel] = useState('')
    const [selectedChannelCategory, setSelectedChannelCategory] = useState('')
    const [selectedChannelCategoryName, setSelectedCategoryName] = useState('')
    const [quick_watch, setquick_watch] = useState([])
    const [Categories, setCategories] = useState([])
    const [AllChannels, SetAllChannels] = useState([])
    // States For Shimmer Effects
    const [isLoadingVideo, setIsLoadingVideo] = useState(true);
    const [isLoadingQuickWatch, setIsLoadingQuickWatch] = useState(true);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [isLoadingAllChannels, setIsLoadingAllChannels] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle the menu

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    const { updateMetadata } = useMetadata();
    
    useEffect(() => {

        emitter.on('customEvent', (data: any) => {
            console.log({data}); 

            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content',data.test);
            }
            console.log({metaDescription});

        });

        const timer = setTimeout(() => {
            setIsLoadingVideo(false); // Simulate video load completion
        }, 3000); // 3 seconds

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://imasdk.googleapis.com/js/sdkloader/ima3.js";
        script.async = true;
        script.onload = () => {
            // console.log("Google IMA SDK successfully loaded:", window.google);
        };
        script.onerror = () => {
            // console.error("Failed to load Google IMA SDK");
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [currentVideo]);

    // const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    // const API_AUTH_TOKEN = process.env.NEXT_PUBLIC_API_AUTH_TOKEN;
    const ACCOUNT_LINK = "https://myaccount.neotvapp.com"
    const API_BASE_URL = 'https://api-houston.khabriya.in/api/v3';
    const API_AUTH_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFmZGQ3YjMzLWY2ZGItNDNlOC05NmM0LTFkNDMyYjc2NDI4NCIsIm1hY19hZGRyZXNzIjoibWFjX2FkZHJlc3MiLCJpYXQiOjE3MzE5NDE0NTF9.RrgsywJ4zNcTfER0Kd48bQZWCQoKO3GOmqYF0PBhPfyc1MOoXwTXVSQzYV1k-60Ch3sD8lWMXFOtC9rFIzOKSFD8hpzoQSzG07FpOLdtgYASuD49pBCk-1EsEOAArX3dWoumHe0C52Uw-NvABdDM1lLIMcQZxsh1DTA1SxMZUfGuPX5oMmdXdFKqyRX0LX8Xa_aDfvA7dhvyPsdqxyMXn_ieeJK9BzzW5NJYKW68gwpOAF6yjzJI-lDYQHKBeqsXSXEpL_vaESdLnZT-gBgvzuC6GgoMCwO8YVu99X7OWc-dDYvS35JJ9Oq0WePm-WBbRHe61iUD4UmsFZS4SCO_3A';

    useEffect(() => {
        if (!emblaApi) return
        onSelect()
        emblaApi.on('select', onSelect)
    }, [emblaApi, onSelect])

    //------------------------Quick-channels Start----------------------------//
    const ListQuickChannels = useCallback(async () => {
        setIsLoadingQuickWatch(true); // Set loading to true while fetching data
        try {
            const response = await axios.post(
                `${API_BASE_URL}/quick-channels`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${API_AUTH_TOKEN}`,
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );
            setquick_watch(response.data.data);

        } catch (error) {
            console.error('Error fetching quick watch channels:', error);
        } finally {
            setIsLoadingQuickWatch(false); // Set loading to false after fetching
        }
    }, []);


    useEffect(() => {
        ListQuickChannels();
    }, [ListQuickChannels]);
    //------------------------Quick-channels End----------------------------//

    //----------------------- Channel categories start -------------------------//
    const fetchCategories = useCallback(async () => {
        setIsLoadingCategories(true);
        try {
            const response = await axios.post(
                `${API_BASE_URL}/languages`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${API_AUTH_TOKEN}`,
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );
            setCategories(response.data.data)
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setIsLoadingCategories(false);
        }
    }, []);


    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleChannelCategoryChange = useCallback((category: string) => {

        const cat = getKeyByValue(category);
        setSelectedChannelCategory(cat)
        setSelectedCategoryName(category)

    }, [])
    //-----------------------Channel categories end-------------------------//

    //-----------------------All channels start-------------------------//
    const fetchChannelsByCategory = useCallback(async () => {
        setIsLoadingAllChannels(true); // Set loading to true while fetching data
        try {
            const response = await axios.post(
                `${API_BASE_URL}/channels`,
                { language: selectedChannelCategoryName },
                {
                    headers: {
                        Authorization: `Bearer ${API_AUTH_TOKEN}`,
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );

            SetAllChannels(response.data.data);
            // if (response.data.data.length > 0) {
            //     setCurrentChannel(response.data.data[0].channel_name);
            //     setCurrentVideo(response.data.data[0].stream_url);
            //     setCurrentChannelId(response.data.data[0].id)
            // }
        } catch (error) {
            console.error('Error fetching channels:', error);
        } finally {
            setIsLoadingAllChannels(false); // Set loading to false after fetching
        }
    }, [selectedChannelCategoryName, currentChannel]);

    useEffect(() => {
        fetchChannelsByCategory();
    }, [selectedChannelCategoryName]);

    //-----------------------All channels end-------------------------//

    // ------------------------ TV statistics Start----------------------//
    const statistics = useCallback(async (currentChannelId) => {
        try {
            await axios.post(
                `${API_BASE_URL}/tv-statistics`,
                { id: currentChannelId },
                {
                    headers: {
                        'Authorization': `Bearer ${API_AUTH_TOKEN}`,
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    }, []);

    useEffect(() => {
        
        if (currentChannelId) {
            statistics(currentChannelId);
        }
    }, [currentChannel, currentChannelId]);
    // ------------------------ TV statistics End----------------------//

    // Utility function to generate slugs
    const generateSlug = (channelName: string = '') => {
        if (channelName !== '') {
            return channelName.toLowerCase().replace(/\s+/g, '-'); // Converts "News Nation" to "news-nation"
        }
        return channelName;
    };

    // Play a channel and update the URL
    const DeepplinkplayChannel = async (channel: any) => {
        try {
            await axios.post(
                `${API_BASE_URL}/deep-link`,
                { channel_name: channel.channel_name },
                {
                    headers: {
                        Authorization: `Bearer ${API_AUTH_TOKEN}`,
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );

            setCurrentVideo(channel.stream_url);
            setCurrentChannel(channel.channel_name);
            setCurrentChannelId(channel.id);

            emitter.emit('customEvent', { test: "Hello" });

            updateMetadata(
                channel.channel_name,
                channel.channel_name
              );
          
            // Update the URL dynamically
            if (selectedChannelCategory !== '') {
                const slug = generateSlug(channel.channel_name);

                const newUrl = `/${selectedChannelCategory}/${slug}`;

                window.history.pushState({}, "", newUrl);

            }
        } catch (error) {
            console.error('Error fetching on DeepplinkplayChannel:', error);
        }
    };

    // Handle slug-based navigation on initial load
    useEffect(() => {
   
     const pathname = window.location.pathname; // Get the current path


        const [_, lang, channelSlug] = pathname.split('/'); // Extract category and channel slugs
        console.log("pathname", pathname, "pathnamepathnamepathname", channelSlug);

        if (lang && selectedChannelCategory === '') {
            setSelectedChannelCategory(lang);
            const cat = getCategory(lang)
            setSelectedCategoryName(cat)
        }

        if (channelSlug) {

            const allChannels = [...quick_watch, ...AllChannels];
            const matchedChannel = allChannels.find(
                (channel) => generateSlug(channel.channel_name) === channelSlug
            );

            console.log(matchedChannel, "matchedChannel");



            if (matchedChannel) {
                DeepplinkplayChannel(matchedChannel); // Play the matched channel
            } else {
                // console.error('No matching channel found for slug:', channelSlug);
                // notFound();
            }
        }

        let selectedLang = lang;
        if (!lang && !channelSlug) {
            selectedLang = 'hi';
        } else if (!channelSlug) {
            selectedLang = lang;
            // selectedLang = `${lang.charAt(0).toUpperCase()}${lang.slice(1)}`;
        }



        if (!channelSlug || (!lang && !channelSlug)) {
            console.log({ selectedLang });

            setSelectedChannelCategory(selectedLang);

            const cat = getCategory(selectedLang)
            setSelectedCategoryName(cat)

            if (AllChannels.length > 0) {
                DeepplinkplayChannel(AllChannels[0])
            }
        }

    }, [quick_watch, AllChannels]);

    return (
        <div className=" md:mx-6 mx-2 ">
            <header className="flex justify-between items-center md:px-8 px-4 py-4 text-white header">
                <div className="flex items-center">
                    <Link href={homeUrl} passHref>
                        <Image src={logoImg} alt="NeoTV+ App Logo" width={140} height={40} className="logo" />
                    </Link>
                </div>
                <div className='flex items-center'>
                    <Link href={playstore} target="_blank" passHref>
                        <Image src={playstoreIcon} alt="NeoTV+ App Logo" width={90} height={40} className="logo hidden md:flex" />
                    </Link>
                    <Link href={ACCOUNT_LINK} target="_blank">
                        <Button variant="outline" className="acc_btn btn bg-[var(--primary-color)] text-white  hover:text-white hidden md:flex"
                            style={{ backgroundColor: 'var(--primary-color)' }}>
                            <User className="mr-2 h-4 w-4" />
                            My Account
                        </Button>
                    </Link>
                </div>

                <div className="flex justify-between items-center md:hidden">
                    <Link href={playstore} target="_blank" passHref>
                        <Image src={playstoreIcon} alt="NeoTV+ PLaystore link Logo" width={90} height={40} className="logo " />
                    </Link>
                    <Button
                        variant="outline"
                        className="md:hidden bg-white text-black toggle_btn"
                        onClick={toggleMenu}
                    >
                        {isMenuOpen ? (
                            <X className="h-6 w-6 text-black bg-white" />
                        ) : (
                            <Menu className="h-6 w-6 text-black bg-white toggle_btn" />
                        )}
                    </Button>
                </div>
            </header>


            {/* Mobile Menu: Slide in from the right */}
            <div
                className={`${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    } fixed top-0 right-0 h-full w-3/4 mobile_bg bg-opacity-80 p-4 transition-transform duration-300 ease-in-out md:hidden z_index`}
            >
                <div className="flex justify-end ">
                    <Button onClick={toggleMenu} variant="outline" className="text-white toggle_btn">
                        <X className="h-6 w-6 text-black bg-white" />
                    </Button>
                </div>

                {Categories.map((category) => (
                    <span
                        key={category.id}
                        onClick={() => {
                            handleChannelCategoryChange(category.insert_language);
                            setIsMenuOpen(false);
                        }}
                        className={`block text-white text-lg mt-3 cursor-pointer px-4 py-2 rounded-md transition-colors duration-300 ${selectedChannelCategoryName == category.insert_language
                            ? 'bg-[var(--primary-color)] text-white'
                            : 'hover:bg-[var(--secondary-color)] text-[var(--primary-color)]'
                            }`}
                    >
                        {category.insert_language}
                    </span>
                ))}

                <div className="my-4">
                    <Button
                        variant="outline"
                        className="acc_btn btn  text-white w-1/2 py-4"
                        style={{ backgroundColor: 'var(--primary-color)' }}
                    >
                        <User className="mr-2 h-4 w-4" />
                        My Account
                    </Button>
                </div>
            </div>

            {/* Desktop Category buttons (always visible on desktop) */}
            <div className="p-4 flex flex-wrap gap-2 justify-center items-center hidden md:flex">
                {isLoadingCategories ? (
                    Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="w-24 h-8 bg-gray-300 shimmer rounded-lg"
                            style={{ width: '100px', height: '40px' }}
                        ></div>
                    ))
                ) : (
                    // Render categories when loaded
                    Categories.map((category) => (
                        <Button
                            key={category.id}
                            variant={selectedChannelCategory === category.insert_language ? 'default' : 'outline'}
                            onClick={() => handleChannelCategoryChange(category.insert_language)}
                            className={`btn ${selectedChannelCategoryName === category.insert_language
                                ? 'bg-[var(--primary-color)] text-white'
                                : 'text-text-white bg-transparent'
                                }`}
                        >
                            {category.insert_language}
                        </Button>
                    ))
                )}
            </div>



            {/* Main content area */}
            <div className="flex flex-col md:flex-row ">
                <div className="w-full md:w-4/6 p-4 ">
                    <div className="flex-grow h_full">
                        {isLoadingVideo ? (
                            <div className="w-full h-full flex">
                                <Shimmer className="flex-grow h-full rounded-lg" />
                            </div>
                        ) : (
                            <LiveVideoPlayer
                                currentVideo={currentVideo}
                                channelChanged={channelChanged}
                            />
                        )}
                    </div>


                    <h2 className="text-2xl font-bold mb-4  mt-4 text-[var(--heading-text-color)]">Quick Watch</h2>

                    {/* Horizontal channel slider */}
                    <div className="mt-4 relative">
                        <div className="overflow-hidden" ref={emblaRef}>
                            <div className="flex">
                                {isLoadingQuickWatch ? (
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <div
                                            key={index}
                                            className="lg:flex-[0_0_18%] flex-[0_0_25%] min-w-0 px-2"
                                        >
                                            <div className="p-2 text-center channels_image">
                                                <div
                                                    className="shimmer rounded-lg mb-2 mx-auto"
                                                    style={{
                                                        width: '50px',
                                                        height: '50px',
                                                        objectFit: 'cover',
                                                    }}
                                                ></div>
                                                <div className="shimmer h-4 w-3/4 mx-auto mb-2 rounded"></div>
                                                <div className="shimmer h-6 w-1/2 mx-auto rounded"></div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    // Show Quick Watch channels when data is loaded
                                    quick_watch.map((channel) => (
                                        <div
                                            key={channel.id}
                                            className="lg:flex-[0_0_18%] flex-[0_0_25%] min-w-0 px-2"
                                        >
                                            <div className="p-2 text-center channels_image">
                                                <Image
                                                    src={channel.image}
                                                    alt={channel.channel_name}
                                                    width={100}
                                                    height={100}
                                                    className="rounded-lg mb-2 mx-auto"
                                                    style={{
                                                        objectFit: 'cover',
                                                        width: '50px',
                                                        height: '50px',
                                                    }}
                                                />
                                                <p className="font-medium text-sm truncate text-white">
                                                    {channel.channel_name}
                                                </p>
                                                <Button
                                                    size="sm"
                                                    // onClick={() => playChannel(channel)}
                                                    onClick={() => DeepplinkplayChannel(channel)}
                                                    className="acc_btn btn mt-2 bg-[var(--primary-color)] text-white hover:bg-[var(--primary-color)]"
                                                >
                                                    <PlayCircle className="h-4 w-4 mr-1" />
                                                    Play
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Scroll Buttons */}
                        <Button
                            size="icon"
                            variant="outline"
                            className="btn_style btn absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-transparent text-white hover:bg-transparent hover:text-white"
                            onClick={scrollPrev}
                            disabled={!canScrollPrev}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Scroll left</span>
                        </Button>
                        <Button
                            size="icon"
                            variant="outline"
                            className="btn_style btn absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-transparent text-white hover:bg-transparent hover:text-white"
                            onClick={scrollNext}
                            disabled={!canScrollNext}
                        >
                            <ChevronRight className="h-4 w-4" />
                            <span className="sr-only">Scroll right</span>
                        </Button>
                    </div>

                </div>

                {/* Channel List (right side, 40%) */}
                <div className="w-full md:w-2/6 p-4">
                    <h2 className="text-2xl font-bold mb-4 text-[var(--heading-text-color)]">
                        {selectedChannelCategoryName === 'all'
                            ? 'All Channels'
                            : `${selectedChannelCategoryName} Channels`}
                    </h2>
                    <ScrollArea className="h-[calc(100vh-180px)]">
                        {isLoadingAllChannels ? (
                            // Shimmer effect during loading
                            Array.from({ length: 10 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="relative flex items-center mb-4 p-2 rounded-lg bg-gray-300 shimmer"
                                >
                                    {/* Shimmer for Thumbnail */}
                                    <div
                                        className="shimmer mr-4"
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '4px',
                                        }}
                                    ></div>

                                    {/* Shimmer for Channel Details */}
                                    <div className="flex-grow">
                                        <div className="shimmer h-4 w-3/4 mb-2 rounded"></div>
                                        <div className="shimmer h-3 w-1/2 rounded"></div>
                                    </div>

                                    {/* Shimmer for Button */}
                                    <div
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 shimmer"
                                        style={{
                                            width: '70px',
                                            height: '30px',
                                            borderRadius: '4px',
                                        }}
                                    ></div>
                                </div>
                            ))
                        ) : (
                            // Render Channels when loaded
                            AllChannels.map((channel) => (
                                <div
                                    key={channel.id}
                                    className={`relative flex items-center mb-4 p-2 rounded-lg cursor-pointer channels_image 
                    ${currentChannel === channel.channel_name
                                            ? 'bg-[var(--secondary-color)] text-white'
                                            : 'hover:bg-[var(--secondary-color)] hover:text-white group'
                                        }`}
                                >
                                    {/* Channel Thumbnail */}
                                    <Image
                                        src={channel.image}
                                        alt={channel.channel_name}
                                        width={50}
                                        height={50}
                                        className="mr-4"
                                    />

                                    {/* Channel Details */}
                                    <div className="flex-grow">
                                        <h3 className="font-semibold text-white">{channel.channel_name}</h3>
                                        <p className="text-sm text-[var(--paragraph-text-color)]">
                                            {channel.add_language}
                                        </p>
                                    </div>

                                    {/* Play Button */}
                                    <div
                                        className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-opacity duration-300 
                        ${currentChannel === channel.channel_name
                                                ? 'opacity-100'
                                                : 'opacity-0 group-hover:opacity-100'
                                            }`}
                                    >
                                        {currentChannel === channel.channel_name ? (
                                            <Button
                                                size="sm"
                                                disabled
                                                className="btn bg-[var(--primary-color)] text-white"
                                            >
                                                <PlayCircle className="h-5 w-5 mr-1" />
                                                Now Playing
                                            </Button>
                                        ) : (
                                            <Button
                                                size="sm"
                                                // onClick={() => playChannel(channel)}
                                                onClick={() => DeepplinkplayChannel(channel)}
                                                className="btn bg-[var(--primary-color)] text-white hover:bg-[var(--primary-color)]"
                                            >
                                                <PlayCircle className="h-5 w-5 mr-1" />
                                                Play
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </ScrollArea>
                </div>



            </div>
        </div>
    );
}