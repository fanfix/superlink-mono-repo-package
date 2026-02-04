'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import ProfileSection from './components/sections/ProfileSection';
import SocialLinksSection from './components/sections/SocialLinksSection';
import CustomButtonsSection from './components/sections/CustomButtonsSection';
import { SortableCustomSectionsEmbedsSection } from './components/sections/CustomSectionsEmbedsSection/SortableCustomSectionsEmbedsSection';
import { SortableBrandKitSection } from './components/sections/BrandKitSection/SortableBrandKitSection';
import EngagementsSection from './components/sections/EngagementsSection';
import PricingPackagesSection from './components/sections/PricingPackagesSection';
import MobilePreview from './components/MobilePreview';
import type { ContentItem, CustomSection, TextSection, BrandKitItem, Engagement, Pricing } from './components/MobilePreview/types';
import type { UploadContentData } from './components/UploadContentModal/types';
import { getSocialIcon } from './components/sections/SocialLinksSection/utils/getSocialIcon';
import { useAuth } from '../../../contexts/AuthContext';
import Loader from '../../../components/Loader';
import {
  useGetCurrentUser,
  useUpdateBio,
  useUpdateUser,
  useAddSocialLink,
  useUpdateSocialLink,
  useRemoveSocialLink,
} from '../../../hooks';
import {
  useUploadExclusiveContent,
  useUpdateExclusiveContent,
  useDeleteExclusiveContent,
} from '../../../hooks';
import {
  useAddCustomButton,
  useUpdateCustomButton,
  useUpdateFavoriteCustomButton,
  useRemoveCustomButton,
} from '../../../hooks';
import {
  useAddCustomSection,
  useUpdateCustomSection,
  useRemoveCustomSection,
  useAddCustomSectionLink,
  useUpdateCustomSectionLink,
  useRemoveCustomSectionLink,
} from '../../../hooks';
import {
  useCreateBrandKit,
  useUpdateBrandKit,
  useDeleteBrandKit,
  useCreateEngagement,
  useUpdateEngagement,
  useDeleteEngagement,
  useCreateBrandKitItem,
  useUpdateBrandKitItem,
  useDeleteBrandKitItem,
} from '../../../hooks';
import { useUploadFile } from '../../../hooks';
import { Toast } from '@superline/design-system';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import {
  PageContainer,
  ContentContainer,
  LeftPanel,
  RightPanel,
  LeftPanelContent,
} from './components/styles/PageLayout.styles';
import type { SocialLink, PageLayout } from './types/page.types';
import { DEFAULT_PAGE_STATE } from './types/page.types';

export default function MyPage() {
  const { currentUser } = useAuth();
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [bioId, setBioId] = useState<string | null>(null);
  
  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info'; visible: boolean }>({
    message: '',
    type: 'success',
    visible: false,
  });

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  }, []);

  // API Hooks
  const { execute: getCurrentUser, loading: loadingUser } = useGetCurrentUser();
  const { execute: updateBio } = useUpdateBio();
  const { execute: updateUser } = useUpdateUser();
  const { execute: addSocialLink } = useAddSocialLink();
  const { execute: updateSocialLink } = useUpdateSocialLink();
  const { execute: removeSocialLink } = useRemoveSocialLink();
  const { execute: uploadExclusiveContent } = useUploadExclusiveContent();
  const { execute: updateExclusiveContent } = useUpdateExclusiveContent();
  const { execute: deleteExclusiveContent } = useDeleteExclusiveContent();
  const { execute: addCustomButton } = useAddCustomButton();
  const { execute: updateCustomButton } = useUpdateCustomButton();
  const { execute: updateFavoriteCustomButton } = useUpdateFavoriteCustomButton();
  const { execute: removeCustomButton } = useRemoveCustomButton();
  const { execute: addCustomSection } = useAddCustomSection();
  const { execute: updateCustomSection } = useUpdateCustomSection();
  const { execute: removeCustomSection } = useRemoveCustomSection();
  const { execute: addCustomSectionLink } = useAddCustomSectionLink();
  const { execute: updateCustomSectionLink } = useUpdateCustomSectionLink();
  const { execute: removeCustomSectionLink } = useRemoveCustomSectionLink();
  const { execute: createBrandKit } = useCreateBrandKit();
  const { execute: updateBrandKit } = useUpdateBrandKit();
  const { execute: deleteBrandKit } = useDeleteBrandKit();
  const { execute: createEngagement } = useCreateEngagement();
  const { execute: updateEngagement } = useUpdateEngagement();
  const { execute: deleteEngagement } = useDeleteEngagement();
  const { execute: createBrandKitItem } = useCreateBrandKitItem();
  const { execute: updateBrandKitItem } = useUpdateBrandKitItem();
  const { execute: deleteBrandKitItem } = useDeleteBrandKitItem();
  const { execute: uploadFile } = useUploadFile();

  // Page basic information state
  const [pageUrl, setPageUrl] = useState<string>(DEFAULT_PAGE_STATE.pageUrl);
  const [pageName, setPageName] = useState<string>(DEFAULT_PAGE_STATE.pageName);
  const [introMessage, setIntroMessage] = useState<string>(DEFAULT_PAGE_STATE.introMessage);

  // Image state
  const [coverImage, setCoverImage] = useState<string>(DEFAULT_PAGE_STATE.coverImage);
  const [profileImage, setProfileImage] = useState<string>(DEFAULT_PAGE_STATE.profileImage);
  const [backgroundImage, setBackgroundImage] = useState<string>(DEFAULT_PAGE_STATE.backgroundImage);

  // Styling state
  const [selectedFont, setSelectedFont] = useState<string>(DEFAULT_PAGE_STATE.selectedFont);
  const [selectedTextColor, setSelectedTextColor] = useState<string>(DEFAULT_PAGE_STATE.selectedTextColor);
  const [selectedLayout, setSelectedLayout] = useState<PageLayout>(DEFAULT_PAGE_STATE.selectedLayout);
  const [backgroundColor, setBackgroundColor] = useState<string>(DEFAULT_PAGE_STATE.backgroundColor);

  // Social links state
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  // Content management state
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [customSections, setCustomSections] = useState<CustomSection[]>([]);
  const [textSections, setTextSections] = useState<TextSection[]>([]);
  const [brandKitItems, setBrandKitItems] = useState<BrandKitItem[]>([]);
  const [brandKitId, setBrandKitId] = useState<string | null>(null); // Store brandKitId separately
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [pricing, setPricing] = useState<Pricing[]>([]);
  
  // Order of sections within CustomSectionsEmbeds (includes 'exclusive-content' and custom section IDs)
  const [customSectionsOrder, setCustomSectionsOrder] = useState<string[]>(['exclusive-content']);
  
  // Custom buttons state
  const [customButtons, setCustomButtons] = useState<Array<{
    id: string;
    buttonText: string;
    type: 'email' | 'url';
    value: string;
    isActive: boolean;
  }>>([]);

  // Load initial data from API - Call currentUser immediately on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // First: Get current user to get bioId and all user data
        const currentUser = await getCurrentUser();
        
        if (!currentUser) {
          setIsLoadingData(false);
          return;
        }
        
        // Set bioId from current user
        if (currentUser.bio?.id) {
          const bioIdValue = currentUser.bio.id;
          setBioId(bioIdValue);
          
          // Use currentUser.bio directly - it already has all the data we need
          const bio = currentUser.bio;
          
          // Set profile data from currentUser.bio
          // Set pageName - prioritize bio.pageName (user's custom page name), then user's name as fallback
          if (bio.pageName && bio.pageName.trim() !== '') {
            setPageName(bio.pageName);
          } else if (currentUser.name) {
            setPageName(currentUser.name);
          }
          
          if (bio.introMessage) {
            setIntroMessage(bio.introMessage);
            setLastSavedIntroMessage(bio.introMessage);
          }
          
          // Set images - ensure we use the actual URLs from API
          if (bio.bannerImageURL) setCoverImage(bio.bannerImageURL);
          if (bio.imageURL) setProfileImage(bio.imageURL);
          if (bio.backgroundImageURL) setBackgroundImage(bio.backgroundImageURL);
          
          if (bio.pageFont) setSelectedFont(bio.pageFont);
          if (bio.textColor) setSelectedTextColor(bio.textColor);
          if (bio.layoutForAvatarAndBio) {
            // Map API format to PageLayout: vertical -> layout1, horizontal -> layout2
            const mappedLayout = bio.layoutForAvatarAndBio === 'vertical' ? 'layout1' : 'layout2';
            setSelectedLayout(mappedLayout as PageLayout);
          }
          if (bio.backgroundColor) setBackgroundColor(bio.backgroundColor);
          
          // Set page URL from username
          if (bio.username) setPageUrl(bio.username);
          
          // Load social links from bio
          if (bio.socialLinks && bio.socialLinks.length > 0) {
            const transformedLinks = bio.socialLinks.map((link) => ({
              id: link.id,
              platform: link.name,
              url: link.url,
              icon: getSocialIcon(link.name, 20, '#FFFFFF'),
            }));
            setSocialLinks(transformedLinks);
          }
          
          // Load custom buttons from bio
          if (bio.customButtons && bio.customButtons.length > 0) {
            const transformedButtons = bio.customButtons.map((btn) => ({
              id: btn.id,
              buttonText: btn.name,
              type: (btn.isEmail ? 'email' : 'url') as 'email' | 'url',
              value: btn.url,
              isActive: btn.isFavorite,
            }));
            setCustomButtons(transformedButtons);
          }
          
          // Load content list from bio.customSections (unlock_content section)
          // Exclusive content is stored in customSections with sectionType: 'unlock_content'
          if (bio.customSections) {
            const unlockContentSection = bio.customSections.find((s) => s.sectionType === 'unlock_content');
            if (unlockContentSection?.unlockContents && unlockContentSection.unlockContents.length > 0) {
              const transformedContents: ContentItem[] = unlockContentSection.unlockContents.map((content: any) => ({
                id: content.id,
                title: content.title || '',
                price: content.price ? (content.price / 100).toString() : '', // Convert from cents to dollars
                imageUrl: content.unlockContentOriginalURL || undefined,
                discount: content.beforeDiscountPrice ? ((content.beforeDiscountPrice - content.price) / content.beforeDiscountPrice * 100).toFixed(0) : undefined,
                countdownMinutes: content.countdownStart ? Math.floor(content.countdownStart / 60).toString() : undefined,
                countdownSeconds: content.countdownStart ? (content.countdownStart % 60).toString() : undefined,
              }));
              setContentItems(transformedContents);
            }
          }
          
          // Load custom sections from bio
          if (bio.customSections && bio.customSections.length > 0) {
            // Transform custom sections to match component types
            const transformedSections: CustomSection[] = bio.customSections
              .filter((section) => section.sectionType !== 'unlock_content' && section.sectionType !== 'brand_kit')
              .map((section) => ({
                id: section.id,
                name: section.name,
                layout: section.rowMode === 'parallel_row' ? 'parallel-row' : section.isRow ? 'row' : 'list',
                useContentImageAsBackground: false,
                sectionType: section.sectionType,
                items: (section.sectionLinks || []).map((link) => ({
                  id: link.id,
                  title: link.name,
                  url: link.url,
                  imageUrl: link.imageURL,
                  price: '',
                  isEmail: link.isEmail,
                })),
              }));
            setCustomSections(transformedSections);
            setCustomSectionsOrder(['exclusive-content', ...transformedSections.map((s) => s.id)]);
          }
          
          // Load brand kit data from bio custom sections
          if (bio.customSections) {
            const brandKitSection = bio.customSections.find((s) => s.sectionType === 'brand_kit');
            if (brandKitSection?.brandKit) {
              const brandKit = brandKitSection.brandKit;
              // Store brandKitId for creating engagements and kit items
              setBrandKitId(brandKit.id);
              
              if (brandKit.bannerImageURL) {
                setBrandKitItems([
                  {
                    id: brandKit.id,
                    thumbnailUrl: brandKit.bannerImageURL,
                    description: brandKit.description,
                  },
                ]);
              }
              
              // Load engagements from brand kit
              if (brandKit.engagements && brandKit.engagements.length > 0) {
                const transformedEngagements = brandKit.engagements.map((eng) => ({
                  id: eng.id,
                  title: eng.title,
                  count: eng.count,
                }));
                setEngagements(transformedEngagements);
              }
              
              // Load pricing (kit items) from brand kit
              if (brandKit.kitItems && brandKit.kitItems.length > 0) {
                const transformedPricing = brandKit.kitItems.map((item) => ({
                  id: item.id,
                  title: item.title,
                  price: (item.price / 100).toString(), // Convert from cents to dollars
                }));
                setPricing(transformedPricing);
              }
            }
          }
        } else {
        }
      } catch (error) {
      } finally {
        setIsLoadingData(false);
      }
    };

    // Call immediately on mount, don't wait for user
    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - call once on mount

  // Handlers for adding content with API - Use exclusive content upload API
  const handleAddContent = useCallback(async (data: UploadContentData) => {
    if (!bioId || !data.file) return;
    
    try {
      // Calculate countdownStart from minutes and seconds
      const countdownStart = data.countdownMinutes && data.countdownSeconds
        ? parseInt(data.countdownMinutes) * 60 + parseInt(data.countdownSeconds)
        : undefined;
      
      // Calculate percentDiscount from discount
      const percentDiscount = data.discount ? parseFloat(data.discount) : undefined;
      
      // Calculate fakePrice (before discount price) if discount exists
      const price = parseFloat(data.price);
      const fakePrice = percentDiscount && percentDiscount > 0
        ? price / (1 - percentDiscount / 100)
        : undefined;
      
      // Use exclusive content upload API (REST endpoint)
      const response = await uploadExclusiveContent(bioId, {
        file: data.file,
        price: price * 100, // Convert to cents
        fakePrice: fakePrice ? fakePrice * 100 : undefined,
        title: data.title,
        titleColor: data.titleColor || '#FFF',
        cropWidth: data.cropWidth || 100,
        cropHeight: data.cropHeight || 100,
        cropX: data.cropX || 0,
        cropY: data.cropY || 0,
        // Order will be set by backend automatically based on existing items
        order: undefined, // Let backend handle ordering
        icon: data.icon || '🔥',
        countdownStart,
        percentDiscount,
        description: data.title || 'Exclusive Content', // Description is required, use title as fallback
      });
      
      if (response) {
        // Transform API response to ContentItem format
        const newItem: ContentItem = {
          id: response.id,
          title: response.title || data.title,
          price: response.price ? (response.price / 100).toString() : data.price, // Convert from cents to dollars
          imageUrl: response.unlockContentOriginalURL,
          discount: response.beforeDiscountPrice && response.price
            ? ((response.beforeDiscountPrice - response.price) / response.beforeDiscountPrice * 100).toFixed(0)
            : data.discount,
          countdownMinutes: response.countdownStart ? Math.floor(response.countdownStart / 60).toString() : data.countdownMinutes,
          countdownSeconds: response.countdownStart ? (response.countdownStart % 60).toString() : data.countdownSeconds,
        };
        
        // Update state immediately using functional update to avoid stale closure
        // This ensures we're working with the latest state without causing re-renders
        setContentItems((prev) => {
          // Check if item already exists (avoid duplicates)
          const exists = prev.some(item => item.id === newItem.id);
          if (exists) {
            return prev; // Don't add duplicate
          }
          // Add new item to the end of the array
          return [...prev, newItem];
        });
        showToast('Content added successfully', 'success');
      }
    } catch (error) {
      showToast('Failed to add content', 'error');
    }
  }, [bioId, uploadExclusiveContent, showToast]);

  const handleUpdateContent = useCallback(async (id: string, data: UploadContentData) => {
    if (!bioId) return;
    
    // Optimistic update - update state immediately
    const currentItem = contentItems.find((item) => item.id === id);
    if (currentItem) {
      setContentItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                title: data.title,
                price: data.price,
                imageUrl: data.file ? URL.createObjectURL(data.file) : item.imageUrl,
                discount: data.discount,
                countdownMinutes: data.countdownMinutes,
                countdownSeconds: data.countdownSeconds,
              }
            : item
        )
      );
    }
    
    try {
      // Calculate countdownStart from minutes and seconds
      const countdownStart = data.countdownMinutes && data.countdownSeconds
        ? parseInt(data.countdownMinutes) * 60 + parseInt(data.countdownSeconds)
        : undefined;
      
      // Calculate percentDiscount from discount
      const percentDiscount = data.discount ? parseFloat(data.discount) : undefined;
      
      // Calculate fakePrice (before discount price) if discount exists
      const price = parseFloat(data.price);
      const fakePrice = percentDiscount && percentDiscount > 0
        ? price / (1 - percentDiscount / 100)
        : undefined;
      
      // Prepare update input
      const updateInput: any = {
        title: data.title,
        price: price * 100, // Convert to cents
        titleColor: data.titleColor || '#FFF',
        description: data.title || 'Exclusive Content',
      };
      
      // Add optional fields if provided
      if (data.file) {
        updateInput.file = data.file;
      }
      if (fakePrice) {
        updateInput.fakePrice = fakePrice * 100;
      }
      if (data.cropWidth !== undefined) {
        updateInput.cropWidth = data.cropWidth;
      }
      if (data.cropHeight !== undefined) {
        updateInput.cropHeight = data.cropHeight;
      }
      if (data.cropX !== undefined) {
        updateInput.cropX = data.cropX;
      }
      if (data.cropY !== undefined) {
        updateInput.cropY = data.cropY;
      }
      if (countdownStart !== undefined) {
        updateInput.countdownStart = countdownStart;
      }
      if (percentDiscount !== undefined) {
        updateInput.percentDiscount = percentDiscount;
      }
      if (data.icon) {
        updateInput.icon = data.icon;
      }
      
      // Call update API
      const response = await updateExclusiveContent(bioId, id, updateInput);
      
      if (response?.content) {
        // Update state with API response data
        setContentItems((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  title: response.content.title,
                  price: (response.content.price / 100).toString(),
                  imageUrl: response.content.unlockContentOriginalURL || item.imageUrl,
                  discount: response.content.beforeDiscountPrice && response.content.price 
                    ? ((response.content.beforeDiscountPrice - response.content.price) / response.content.beforeDiscountPrice * 100).toFixed(0) 
                    : undefined,
                  countdownMinutes: response.content.countdownStart ? Math.floor(response.content.countdownStart / 60).toString() : undefined,
                  countdownSeconds: response.content.countdownStart ? (response.content.countdownStart % 60).toString() : undefined,
                }
              : item
          )
        );
        showToast('Content updated successfully', 'success');
      }
    } catch (error) {
      showToast('Failed to update content', 'error');
      // Revert state on error
      if (currentItem) {
        setContentItems((prev) =>
          prev.map((item) => (item.id === id ? currentItem : item))
        );
      }
    }
  }, [bioId, updateExclusiveContent, contentItems, showToast]);

  const handleDeleteContent = useCallback(async (id: string) => {
    if (!bioId) return;
    
    // Optimistic delete - remove from state immediately
    const deletedItem = contentItems.find((item) => item.id === id);
    setContentItems((prev) => prev.filter((item) => item.id !== id));
    
    try {
      // Call delete API
      await deleteExclusiveContent(bioId, id);
      showToast('Content deleted successfully', 'success');
    } catch (error) {
      showToast('Failed to delete content', 'error');
      // Revert state on error - restore deleted item
      if (deletedItem) {
        setContentItems((prev) => [...prev, deletedItem]);
      }
    }
  }, [bioId, deleteExclusiveContent, contentItems, showToast]);

  const handleAddCustomSection = useCallback(async (sectionName: string, layout: 'list' | 'row' | 'parallel-row', useContentImageAsBackground: boolean, sectionType: 'links' | 'embeds' | 'email' | 'text' = 'links') => {
    try {
      const isRow = layout === 'row' || layout === 'parallel-row';
      const isEmbed = sectionType === 'embeds';
      const listMode = 'fullscreen' as 'thumbnail' | 'fullscreen';
      const rowMode = layout === 'parallel-row' ? 'parallel_row' : layout === 'row' ? 'grid' : 'slider';
      
      const response = await addCustomSection({
        name: sectionName,
        isRow,
        isEmbed,
        listMode,
        rowMode,
        sectionType,
      });
      
      if (response) {
        const newSection: CustomSection = {
          id: response.id,
          name: sectionName,
          layout,
          useContentImageAsBackground,
          items: [],
        };
        setCustomSections((prev) => [...prev, newSection]);
        setCustomSectionsOrder((prev) => [...prev, newSection.id]);
        showToast('Section added successfully', 'success');
      }
    } catch (error) {
      showToast('Failed to add section', 'error');
    }
  }, [addCustomSection, showToast]);

  const handleAddEmbedSection = useCallback(async (sectionName: string, layout: 'list' | 'row') => {
    await handleAddCustomSection(sectionName, layout, false, 'embeds');
  }, [handleAddCustomSection]);

  const handleUpdateCustomSection = useCallback(async (id: string, sectionName: string, layout: 'list' | 'row' | 'parallel-row', useContentImageAsBackground: boolean) => {
    // Find the section to determine if it's an embed section
    const section = customSections.find((s) => s.id === id);
    const isEmbed = section?.sectionType === 'embeds';
    
    try {
      const isRow = layout === 'row' || layout === 'parallel-row';
      const listMode = 'fullscreen' as 'thumbnail' | 'fullscreen';
      const rowMode = layout === 'parallel-row' ? 'parallel_row' : layout === 'row' ? 'grid' : 'slider';
      
      await updateCustomSection(id, {
        name: sectionName,
        isRow,
        isEmbed,
        listMode,
        rowMode,
      });
      
    setCustomSections((prev) =>
      prev.map((section) =>
        section.id === id
          ? { ...section, name: sectionName, layout, useContentImageAsBackground }
          : section
      )
    );
      showToast(isEmbed ? 'Embed section updated successfully' : 'Section updated successfully', 'success');
    } catch (error) {
      showToast(isEmbed ? 'Failed to update embed section' : 'Failed to update section', 'error');
    }
  }, [updateCustomSection, customSections, showToast]);

  const handleDeleteCustomSection = useCallback(async (id: string) => {
    // Find the section to determine if it's an embed section
    const section = customSections.find((s) => s.id === id);
    const isEmbedSection = section?.sectionType === 'embeds';
    
    try {
      await removeCustomSection(id);
    setCustomSections((prev) => prev.filter((section) => section.id !== id));
    setCustomSectionsOrder((prev) => prev.filter((sectionId) => sectionId !== id));
      showToast(isEmbedSection ? 'Embed section deleted successfully' : 'Section deleted successfully', 'success');
    } catch (error) {
      showToast(isEmbedSection ? 'Failed to delete embed section' : 'Failed to delete section', 'error');
    }
  }, [removeCustomSection, customSections, showToast]);

  // Helper function to convert base64 string to File
  const base64ToFile = useCallback((base64String: string, filename: string = 'image.png'): File => {
    // Extract base64 data and mime type
    const arr = base64String.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }, []);

  const handleAddContentToCustomSection = useCallback(async (sectionId: string, data: { thumbnail?: string | File; title: string; url: string; isEmail: boolean; size?: string }) => {
    try {
      let imageURL: string = '';
      
      if (data.thumbnail instanceof File) {
        const uploadResponse = await uploadFile(data.thumbnail);
        imageURL = uploadResponse?.imageURL || '';
      } else if (typeof data.thumbnail === 'string') {
        if (data.thumbnail.startsWith('data:image/')) {
          const file = base64ToFile(data.thumbnail, `thumbnail-${Date.now()}.png`);
          const uploadResponse = await uploadFile(file);
          imageURL = uploadResponse?.imageURL || '';
        } else {
          imageURL = data.thumbnail;
        }
      }
      
      const response = await addCustomSectionLink(sectionId, {
        name: data.title,
        url: data.url,
        imageURL,
        content: '',
        isEmail: data.isEmail,
        size: data.size,
      });
      
      if (response) {
          const newItem: ContentItem = {
          id: response.id,
            title: data.title,
          price: '',
          imageUrl: imageURL,
            url: data.url,
            isEmail: data.isEmail,
          };
        
        setCustomSections((prev) =>
          prev.map((section) => {
            if (section.id === sectionId) {
          return {
            ...section,
            items: [...section.items, newItem],
          };
        }
        return section;
      })
    );
      }
      showToast('Item added successfully', 'success');
    } catch (error) {
      showToast('Failed to add item', 'error');
    }
  }, [addCustomSectionLink, uploadFile, base64ToFile, showToast]);

  const handleUpdateContentInCustomSection = useCallback(async (sectionId: string, itemId: string, data: { thumbnail?: string | File; title: string; url: string; isEmail: boolean }) => {
    try {
      let imageURL: string | undefined;
      
      // Handle file upload - convert base64 to File if needed
      if (data.thumbnail instanceof File) {
        // Direct file upload
        const uploadResponse = await uploadFile(data.thumbnail);
        imageURL = uploadResponse?.imageURL;
      } else if (typeof data.thumbnail === 'string') {
        // Check if it's a base64 string (data:image/...)
        if (data.thumbnail.startsWith('data:image/')) {
          // Convert base64 to File and upload
          const file = base64ToFile(data.thumbnail, `thumbnail-${Date.now()}.png`);
          const uploadResponse = await uploadFile(file);
          imageURL = uploadResponse?.imageURL;
        } else {
          // It's already a URL, use it directly
          imageURL = data.thumbnail;
        }
      }
      
      await updateCustomSectionLink(itemId, {
        name: data.title,
        url: data.url,
        imageURL: imageURL || '',
        content: '',
        isEmail: data.isEmail,
      });
      
    setCustomSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.map((item) =>
              item.id === itemId
                ? {
                    ...item,
                    title: data.title,
                      imageUrl: imageURL || item.imageUrl,
                    url: data.url,
                    isEmail: data.isEmail,
                  }
                : item
            ),
          };
        }
        return section;
      })
    );
      showToast('Item updated successfully', 'success');
    } catch (error) {
      showToast('Failed to update item', 'error');
    }
  }, [updateCustomSectionLink, uploadFile, base64ToFile, showToast]);

  const handleDeleteContentFromCustomSection = useCallback(async (sectionId: string, itemId: string) => {
    try {
      await removeCustomSectionLink(itemId);
      
    setCustomSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.filter((item) => item.id !== itemId),
          };
        }
        return section;
      })
    );
      showToast('Item deleted successfully', 'success');
    } catch (error) {
      showToast('Failed to delete item', 'error');
    }
  }, [removeCustomSectionLink, showToast]);

  const handleReorderItemsInCustomSection = useCallback((sectionId: string, newItems: ContentItem[]) => {
    setCustomSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: newItems,
          };
        }
        return section;
      })
    );
  }, []);

  const handleReorderSectionsInCustomSectionsEmbeds = useCallback((sectionIds: string[]) => {
    // sectionIds array contains 'exclusive-content' and custom section IDs in new order
    // Update the order state to reflect the new position
    setCustomSectionsOrder(sectionIds);
    
    // Also reorder customSections based on this order (excluding 'exclusive-content')
    const exclusiveContentId = 'exclusive-content';
    const customSectionIds = sectionIds.filter((id) => id !== exclusiveContentId);
    
    setCustomSections((prev) => {
      // Create a map for quick lookup
      const sectionMap = new Map(prev.map((s) => [s.id, s]));
      // Reorder based on the new order
      const reordered: CustomSection[] = [];
      for (const id of customSectionIds) {
        const section = sectionMap.get(id);
        if (section) {
          reordered.push(section);
        }
      }
      // Add any sections that weren't in the reorder list (shouldn't happen, but safety)
      for (const section of prev) {
        if (!customSectionIds.includes(section.id)) {
          reordered.push(section);
        }
      }
      return reordered;
    });
  }, []);

  const handleAddTextSection = useCallback(async (title: string, content: string) => {
    try {
      const response = await addCustomSection({
        name: title,
        isRow: false,
        isEmbed: false,
        listMode: 'thumbnail',
        rowMode: 'slider',
        sectionType: 'text',
        section: {
          name: '',
          url: 'https://superlink.io',
          imageURL: '',
          isEmail: false,
          content: content,
        },
      });
      
      if (response) {
    const newSection: TextSection = {
          id: response.id,
      title,
      content,
          type: 'text',
    };
    setTextSections((prev) => [...prev, newSection]);
        showToast('Text section added successfully', 'success');
      }
    } catch (error) {
      showToast('Failed to add text section', 'error');
    }
  }, [addCustomSection, showToast]);

  const handleAddEmailSection = useCallback(async (title: string, content: string) => {
    try {
      const response = await addCustomSection({
        name: title,
        isRow: false,
        isEmbed: false,
        listMode: 'fullscreen',
        rowMode: 'slider',
        sectionType: 'email',
        section: {
          name: '',
          url: 'https://superlink.io',
          imageURL: '',
          isEmail: true,
          content: content,
        },
      });
      
      if (response) {
    const newSection: TextSection = {
          id: response.id,
      title,
      content,
          type: 'email',
    };
    setTextSections((prev) => [...prev, newSection]);
        showToast('Email section added successfully', 'success');
      }
    } catch (error) {
      showToast('Failed to add email section', 'error');
    }
  }, [addCustomSection, showToast]);

  const handleUpdateEmailSection = useCallback(async (id: string, title: string, content: string) => {
    try {
      await updateCustomSection(id, {
        name: title,
        isRow: false,
        isEmbed: false,
        listMode: 'fullscreen',
        rowMode: 'slider',
      });
      
      // Also update the section link content if it exists
      // Note: This might need to find and update the section link separately
      
    setTextSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, title, content } : section
      )
    );
      showToast('Email section updated successfully', 'success');
    } catch (error) {
      showToast('Failed to update email section', 'error');
    }
  }, [updateCustomSection, showToast]);

  const handleDeleteEmailSection = useCallback(async (id: string) => {
    try {
      await removeCustomSection(id);
    setTextSections((prev) => prev.filter((section) => section.id !== id));
      showToast('Email section deleted successfully', 'success');
    } catch (error) {
      showToast('Failed to delete email section', 'error');
    }
  }, [removeCustomSection, showToast]);

  const handleUpdateTextSection = useCallback(async (id: string, title: string, content: string) => {
    try {
      await updateCustomSection(id, {
        name: title,
        isRow: false,
        isEmbed: false,
        listMode: 'thumbnail',
        rowMode: 'slider',
      });
      
      // Also update the section link content if it exists
      // Note: This might need to find and update the section link separately
      
    setTextSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, title, content } : section
      )
    );
      showToast('Text section updated successfully', 'success');
    } catch (error) {
      showToast('Failed to update text section', 'error');
    }
  }, [updateCustomSection, showToast]);

  const handleDeleteTextSection = useCallback(async (id: string) => {
    try {
      await removeCustomSection(id);
    setTextSections((prev) => prev.filter((section) => section.id !== id));
      showToast('Text section deleted successfully', 'success');
    } catch (error) {
      showToast('Failed to delete text section', 'error');
    }
  }, [removeCustomSection, showToast]);

  const handleReorderTextSections = useCallback((sectionIds: string[]) => {
    setTextSections((prev) => {
      // Create a map for quick lookup
      const sectionMap = new Map(prev.map((s) => [s.id, s]));
      // Reorder based on the new order
      const reordered: TextSection[] = [];
      for (const id of sectionIds) {
        const section = sectionMap.get(id);
        if (section) {
          reordered.push(section);
        }
      }
      // Add any sections that weren't in the reorder list (shouldn't happen, but safety)
      for (const section of prev) {
        if (!sectionIds.includes(section.id)) {
          reordered.push(section);
        }
      }
      return reordered;
    });
  }, []);

  const handleAddBrandKit = useCallback(async (thumbnail: File | null, description: string) => {
    try {
      let bannerImageURL: string | undefined;
      
      // Upload file if provided
      if (thumbnail) {
        const uploadResponse = await uploadFile(thumbnail);
        bannerImageURL = uploadResponse?.imageURL;
      }
      
      // Find or create brand kit section
      let brandKitSectionId: string | null = null;
      
      // Check if brand kit section already exists
      if (currentUser?.bio?.customSections) {
        const existingBrandKitSection = currentUser.bio.customSections.find(
          (s) => s.sectionType === 'brand_kit'
        );
        if (existingBrandKitSection) {
          brandKitSectionId = existingBrandKitSection.id;
        }
      }
      
      // If no brand kit section exists, create one first
      if (!brandKitSectionId) {
        const sectionResponse = await addCustomSection({
          name: 'Brand Kit',
          isRow: false,
          isEmbed: false,
          listMode: 'fullscreen',
          rowMode: 'slider',
          sectionType: 'brand_kit',
        });
        if (sectionResponse) {
          brandKitSectionId = sectionResponse.id;
        } else {
          throw new Error('Failed to create brand kit section');
        }
      }
      
      // Create brand kit using Brand Kit API
      const response = await createBrandKit({
        bannerImageURL,
        description,
      });
      
      if (response) {
        // Store brandKitId immediately for creating engagements and kit items
        setBrandKitId(response.id);
        
        // Update local state
        const newItem: BrandKitItem = {
          id: response.id,
          thumbnailUrl: response.bannerImageURL || bannerImageURL || undefined,
          description: response.description || description || '',
        };
        setBrandKitItems([newItem]);
        showToast('Brand kit added successfully', 'success');
      }
    } catch (error) {
      showToast('Failed to add brand kit', 'error');
    }
  }, [uploadFile, createBrandKit, addCustomSection, currentUser, showToast]);

  const handleUpdateBrandKit = useCallback(async (id: string, thumbnail: File | null, description: string) => {
    try {
      let bannerImageURL: string | undefined;
      
      // Upload file if provided
      if (thumbnail) {
        const uploadResponse = await uploadFile(thumbnail);
        bannerImageURL = uploadResponse?.imageURL;
      }
      
      // Update brand kit using Brand Kit API
      const response = await updateBrandKit(id, {
        bannerImageURL,
        description,
      });
      
      if (response) {
        setBrandKitItems((prev) =>
          prev.map((item) => {
            if (item.id === id) {
              return {
                ...item,
                thumbnailUrl: response.bannerImageURL || bannerImageURL || item.thumbnailUrl,
                description: response.description || description,
              };
            }
            return item;
          })
        );
        showToast('Brand kit updated successfully', 'success');
      }
    } catch (error) {
      showToast('Failed to update brand kit', 'error');
    }
  }, [uploadFile, updateBrandKit, showToast]);

  const handleDeleteBrandKit = useCallback(async (id: string) => {
    try {
      // Delete brand kit using Brand Kit API
      await deleteBrandKit(id);
      
      // Update local state
      setBrandKitItems((prev) => prev.filter((item) => item.id !== id));
      setBrandKitId(null);
      setEngagements([]);
      setPricing([]);
      showToast('Brand kit deleted successfully', 'success');
    } catch (error) {
      showToast('Failed to delete brand kit', 'error');
    }
  }, [deleteBrandKit, showToast]);

  const handleReorderBrandKit = useCallback((itemIds: string[]) => {
    setBrandKitItems((prev) => {
      const itemMap = new Map(prev.map((item) => [item.id, item]));
      const reordered: BrandKitItem[] = [];
      for (const id of itemIds) {
        const item = itemMap.get(id);
        if (item) {
          reordered.push(item);
        }
      }
      for (const item of prev) {
        if (!itemIds.includes(item.id)) {
          reordered.push(item);
        }
      }
      return reordered;
    });
  }, []);

  // Engagement handlers with API
  const handleAddEngagement = useCallback(async (data: { title: string; count: string }) => {
    if (!brandKitId) return;
    
    try {
      const response = await createEngagement(brandKitId, {
        title: data.title,
        count: data.count,
      });
      
      if (response) {
    const newEngagement: Engagement = {
          id: response.id,
      title: data.title,
      count: data.count,
    };
    setEngagements((prev) => [...prev, newEngagement]);
        showToast('Engagement added successfully', 'success');
      }
    } catch (error) {
      showToast('Failed to add engagement', 'error');
    }
  }, [brandKitId, createEngagement, showToast]);

  const handleUpdateEngagement = useCallback(async (id: string, data: { title: string; count: string }) => {
    try {
      // Update engagement uses engagementId directly, not brandKitId
      await updateEngagement(id, {
        title: data.title,
        count: data.count,
      });
      
    setEngagements((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...data } : item))
    );
    } catch (error) {
    }
  }, [updateEngagement]);

  const handleDeleteEngagement = useCallback(async (id: string) => {
    try {
      // Delete engagement uses engagementId directly
      await deleteEngagement(id);
    setEngagements((prev) => prev.filter((item) => item.id !== id));
      showToast('Engagement deleted successfully', 'success');
    } catch (error) {
      showToast('Failed to delete engagement', 'error');
    }
  }, [deleteEngagement, showToast]);

  const handleReorderEngagements = useCallback((itemIds: string[]) => {
    setEngagements((prev) => {
      const itemMap = new Map(prev.map((item) => [item.id, item]));
      const reordered: Engagement[] = [];
      for (const id of itemIds) {
        const item = itemMap.get(id);
        if (item) {
          reordered.push(item);
        }
      }
      for (const item of prev) {
        if (!itemIds.includes(item.id)) {
          reordered.push(item);
        }
      }
      return reordered;
    });
  }, []);

  // Pricing handlers with API (using BrandKitItem APIs)
  const handleAddPricing = useCallback(async (data: { title: string; price: string }) => {
    if (!brandKitId) return;
    
    try {
      const response = await createBrandKitItem(brandKitId, {
        title: data.title,
        price: parseFloat(data.price) * 100, // API expects price in cents (400 becomes 40000)
      });
      
      if (response) {
    const newPricing: Pricing = {
          id: response.id,
      title: data.title,
      price: data.price,
    };
    setPricing((prev) => [...prev, newPricing]);
        showToast('Pricing package added successfully', 'success');
      }
    } catch (error) {
      showToast('Failed to add pricing package', 'error');
    }
  }, [brandKitId, createBrandKitItem, showToast]);

  const handleUpdatePricing = useCallback(async (id: string, data: { title: string; price: string }) => {
    try {
      await updateBrandKitItem(id, {
        title: data.title,
        price: parseFloat(data.price) * 100, // API expects price in cents
      });
      
    setPricing((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...data } : item))
    );
      showToast('Pricing package updated successfully', 'success');
    } catch (error) {
      showToast('Failed to update pricing package', 'error');
    }
  }, [updateBrandKitItem, showToast]);

  const handleDeletePricing = useCallback(async (id: string) => {
    try {
      await deleteBrandKitItem(id);
    setPricing((prev) => prev.filter((item) => item.id !== id));
      showToast('Pricing package deleted successfully', 'success');
    } catch (error) {
      showToast('Failed to delete pricing package', 'error');
    }
  }, [deleteBrandKitItem, showToast]);

  const handleReorderPricing = useCallback((itemIds: string[]) => {
    setPricing((prev) => {
      const itemMap = new Map(prev.map((item) => [item.id, item]));
      const reordered: Pricing[] = [];
      for (const id of itemIds) {
        const item = itemMap.get(id);
        if (item) {
          reordered.push(item);
        }
      }
      for (const item of prev) {
        if (!itemIds.includes(item.id)) {
          reordered.push(item);
        }
      }
      return reordered;
    });
  }, []);

  // Handlers for custom buttons with API
  const handleAddCustomButton = useCallback(async (data: { buttonText: string; type: 'email' | 'url'; value: string }) => {
    try {
      const response = await addCustomButton({
        name: data.buttonText,
        url: data.value,
        isEmail: data.type === 'email',
      });
      
      if (response) {
    const newButton = {
          id: response.id,
      buttonText: data.buttonText,
      type: data.type,
      value: data.value,
      isActive: false,
    };
    setCustomButtons((prev) => [...prev, newButton]);
        showToast('Custom button added successfully', 'success');
      }
    } catch (error) {
      showToast('Failed to add custom button', 'error');
    }
  }, [addCustomButton, showToast]);

  const handleReorderCustomButtons = useCallback((newButtons: typeof customButtons) => {
    setCustomButtons(newButtons);
  }, []);

  const handleToggleCustomButtonActive = useCallback(async (id: string) => {
    try {
      await updateFavoriteCustomButton(id);
    setCustomButtons((prev) =>
      prev.map((button) => (button.id === id ? { ...button, isActive: !button.isActive } : button))
    );
      showToast('Button favorite status updated', 'success');
    } catch (error) {
      showToast('Failed to update button favorite status', 'error');
    }
  }, [updateFavoriteCustomButton, showToast]);

  const handleUpdateCustomButton = useCallback(async (id: string, data: { buttonText: string; type: 'email' | 'url'; value: string }) => {
    try {
      await updateCustomButton(id, {
        name: data.buttonText,
        url: data.value,
        isEmail: data.type === 'email',
      });
      
    setCustomButtons((prev) =>
      prev.map((button) =>
        button.id === id
          ? { ...button, buttonText: data.buttonText, type: data.type, value: data.value }
          : button
      )
    );
      showToast('Custom button updated successfully', 'success');
    } catch (error) {
      showToast('Failed to update custom button', 'error');
    }
  }, [updateCustomButton, showToast]);

  const handleDeleteCustomButton = useCallback(async (id: string) => {
    try {
      // Call API to delete custom button
      await removeCustomButton(id);
      // Update state after successful API call
    setCustomButtons((prev) => prev.filter((button) => button.id !== id));
      showToast('Custom button deleted successfully', 'success');
    } catch (error) {
      // Revert state on error - reload from API
      try {
        const currentUser = await getCurrentUser();
        if (currentUser?.bio?.customButtons) {
          const transformedButtons = currentUser.bio.customButtons.map((btn) => ({
            id: btn.id,
            buttonText: btn.name,
            type: (btn.isEmail ? 'email' : 'url') as 'email' | 'url',
            value: btn.url,
            isActive: btn.isFavorite,
          }));
          setCustomButtons(transformedButtons);
        }
      } catch {}
      showToast('Failed to delete custom button', 'error');
    }
  }, [removeCustomButton, getCurrentUser, showToast]);

  // Section order state for drag and drop
  const [sectionOrder, setSectionOrder] = useState<string[]>([
    'custom-sections-embeds',
    'brand-kit',
    'engagements',
    'pricing-packages',
  ]);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSectionDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSectionOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  // Handle body overflow - hidden on desktop, remove on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 900) {
        // Desktop: hide overflow
        document.body.style.overflow = 'hidden';
      } else {
        // Mobile: remove overflow restriction
        document.body.style.overflow = '';
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handler for adding new social link with API
  const handleAddSocialLink = useCallback(async (platform: string, url: string, username: string = '') => {
    try {
      const response = await addSocialLink({
        name: platform,
        url,
        username,
      });
      
      if (response) {
    const newLink = {
          id: response.id,
      platform,
      url,
      icon: getSocialIcon(platform, 20, '#000000'),
    };
    setSocialLinks((prevLinks) => [...prevLinks, newLink]);
        showToast('Social link added successfully', 'success');
      }
    } catch (error) {
      showToast('Failed to add social link', 'error');
    }
  }, [addSocialLink, showToast]);

  // Handler for updating social link with API
  const handleUpdateSocialLink = useCallback(async (id: string, platform: string, url: string, username: string = '') => {
    try {
      const response = await updateSocialLink(id, {
        name: platform,
        url,
        username,
      });
      
      if (response) {
        setSocialLinks((prevLinks) =>
          prevLinks.map((link) =>
            link.id === id
              ? {
                  ...link,
                  platform,
                  url,
                  icon: getSocialIcon(platform, 20, '#000000'),
                }
              : link
          )
        );
        showToast('Social link updated successfully', 'success');
      }
    } catch (error) {
      showToast('Failed to update social link', 'error');
    }
  }, [updateSocialLink, showToast]);

  // Handler for removing social link with API
  const handleRemoveSocialLink = useCallback(async (id: string) => {
    try {
      await removeSocialLink(id);
      setSocialLinks((prevLinks) => prevLinks.filter((link) => link.id !== id));
      showToast('Social link removed successfully', 'success');
    } catch (error) {
      showToast('Failed to remove social link', 'error');
    }
  }, [removeSocialLink, showToast]);

  // Handler for reordering social links with API
  const handleReorderSocialLinks = useCallback(async (newLinks: SocialLink[]) => {
    try {
      // Update order in API for each link
      // Note: Order updates might be handled by the backend automatically based on the order field
      // For now, update state - backend should handle order based on the order field in response
      setSocialLinks(newLinks);
      
      // If individual updates are needed, we can update each link
      // But typically the backend handles order automatically
    } catch {}
  }, []);

  // Track last saved page name to compare with current input
  const [lastSavedPageName, setLastSavedPageName] = useState<string>(pageName);
  const [lastSavedPageUrl, setLastSavedPageUrl] = useState<string>(pageUrl);
  const [lastSavedIntroMessage, setLastSavedIntroMessage] = useState<string>(introMessage);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const debouncePageUrlTimerRef = useRef<NodeJS.Timeout | null>(null);
  const debounceIntroMessageTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce page name API call - wait 5 seconds after user stops typing
  const handlePageNameChange = useCallback((name: string) => {
    // Update local state immediately for instant UI feedback
    setPageName(name);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for API call
    debounceTimerRef.current = setTimeout(async () => {
      if (bioId && name !== lastSavedPageName && name.trim() !== '') {
        try {
          // Update API after 5 seconds of no typing
          await updateBio(bioId, { pageName: name });
          setLastSavedPageName(name);
          showToast('Page name updated successfully', 'success');
        } catch (error) {
          showToast('Failed to update page name', 'error');
          // Revert state on error - reload from API
          try {
            const currentUser = await getCurrentUser();
            if (currentUser?.bio?.pageName && currentUser.bio.pageName.trim() !== '') {
              setPageName(currentUser.bio.pageName);
              setLastSavedPageName(currentUser.bio.pageName);
            } else if (currentUser?.name) {
              setPageName(currentUser.name);
              setLastSavedPageName(currentUser.name);
            }
          } catch {}
        }
      }
      debounceTimerRef.current = null;
    }, 5000); // 5 seconds debounce
  }, [bioId, lastSavedPageName, updateBio, getCurrentUser, showToast]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Initialize lastSavedPageName when pageName is loaded from API (initial load only)
  useEffect(() => {
    if (pageName && lastSavedPageName === '') {
      setLastSavedPageName(pageName);
    }
  }, [pageName, lastSavedPageName]);

  // Debounce pageUrl API call - wait 2 seconds after user stops typing
  const handlePageUrlChange = useCallback((url: string) => {
    // Update local state immediately for instant UI feedback
    setPageUrl(url);

    // Clear existing timer
    if (debouncePageUrlTimerRef.current) {
      clearTimeout(debouncePageUrlTimerRef.current);
    }

    // Set new timer for API call
    debouncePageUrlTimerRef.current = setTimeout(async () => {
      if (bioId && url !== lastSavedPageUrl && url.trim() !== '') {
        try {
          // Update API after 2 seconds of no typing
          await updateBio(bioId, { username: url.trim() });
          setLastSavedPageUrl(url);
          showToast('Page URL updated successfully', 'success');
        } catch (error) {
          showToast('Failed to update page URL', 'error');
          // Revert state on error - reload from API
          try {
            const currentUser = await getCurrentUser();
            if (currentUser?.bio?.username) {
              setPageUrl(currentUser.bio.username);
              setLastSavedPageUrl(currentUser.bio.username);
            }
          } catch {}
        }
      }
      debouncePageUrlTimerRef.current = null;
    }, 2000); // 2 seconds debounce
  }, [bioId, lastSavedPageUrl, updateBio, getCurrentUser, showToast]);

  // Cleanup pageUrl timer on unmount
  useEffect(() => {
    return () => {
      if (debouncePageUrlTimerRef.current) {
        clearTimeout(debouncePageUrlTimerRef.current);
      }
    };
  }, []);

  // Cleanup intro message timer on unmount
  useEffect(() => {
    return () => {
      if (debounceIntroMessageTimerRef.current) {
        clearTimeout(debounceIntroMessageTimerRef.current);
      }
    };
  }, []);

  // Initialize lastSavedPageUrl when pageUrl is loaded from API (initial load only)
  useEffect(() => {
    if (pageUrl && lastSavedPageUrl === '') {
      setLastSavedPageUrl(pageUrl);
    }
  }, [pageUrl, lastSavedPageUrl]);

  // Initialize lastSavedIntroMessage when introMessage is loaded from API (initial load only)
  useEffect(() => {
    if (introMessage && lastSavedIntroMessage === '') {
      setLastSavedIntroMessage(introMessage);
    }
  }, [introMessage, lastSavedIntroMessage]);

  // Debounce intro message API call - wait 2 seconds after user stops typing
  const handleIntroMessageChange = useCallback((message: string) => {
    // Update local state immediately for instant UI feedback
    setIntroMessage(message);

    // Clear existing timer
    if (debounceIntroMessageTimerRef.current) {
      clearTimeout(debounceIntroMessageTimerRef.current);
    }

    // Set new timer for API call
    debounceIntroMessageTimerRef.current = setTimeout(async () => {
      if (bioId && message !== lastSavedIntroMessage && message.trim() !== '') {
        try {
          // Update API after 2 seconds of no typing
          await updateBio(bioId, { introMessage: message });
          setLastSavedIntroMessage(message);
          showToast('Intro message updated successfully', 'success');
        } catch (error) {
          showToast('Failed to update intro message', 'error');
          // Revert state on error - reload from API
          try {
            const currentUser = await getCurrentUser();
            if (currentUser?.bio?.introMessage) {
              setIntroMessage(currentUser.bio.introMessage);
              setLastSavedIntroMessage(currentUser.bio.introMessage);
            }
          } catch {}
        }
      }
      debounceIntroMessageTimerRef.current = null;
    }, 2000); // 2 seconds debounce
  }, [bioId, lastSavedIntroMessage, updateBio, getCurrentUser, showToast]);

  const handleCoverImageChange = useCallback(async (fileOrUrl: File | string) => {
    try {
      let imageUrl: string;
      
      // If it's a File object, upload it first
      if (fileOrUrl instanceof File) {
        const uploadResponse = await uploadFile(fileOrUrl);
        if (!uploadResponse?.imageURL) {
          throw new Error('Failed to upload cover image');
        }
        imageUrl = uploadResponse.imageURL;
      } else {
        // If it's already a URL string (for removal, pass empty string)
        imageUrl = fileOrUrl;
      }
      
      // Update state optimistically
      setCoverImage(imageUrl);
      
      // Update bio with the uploaded image URL
      if (bioId && imageUrl) {
        await updateBio(bioId, { bannerImageURL: imageUrl });
        showToast('Cover image updated successfully', 'success');
      } else if (bioId && !imageUrl) {
        // Remove image
        await updateBio(bioId, { bannerImageURL: '' });
        showToast('Cover image removed successfully', 'success');
      }
    } catch (error) {
      showToast('Failed to update cover image', 'error');
      // Revert state on error - reload from API
      if (bioId) {
        try {
          const currentUser = await getCurrentUser();
          if (currentUser?.bio?.bannerImageURL) setCoverImage(currentUser.bio.bannerImageURL);
        } catch {}
      }
    }
  }, [bioId, updateBio, uploadFile, getCurrentUser, showToast]);

  const handleProfileImageChange = useCallback(async (fileOrUrl: File | string) => {
    try {
      let imageUrl: string;
      
      // If it's a File object, upload it first
      if (fileOrUrl instanceof File) {
        const uploadResponse = await uploadFile(fileOrUrl);
        if (!uploadResponse?.imageURL) {
          throw new Error('Failed to upload profile image');
        }
        imageUrl = uploadResponse.imageURL;
      } else {
        // If it's already a URL string (for removal, pass empty string)
        imageUrl = fileOrUrl;
      }
      
      // Update state optimistically
      setProfileImage(imageUrl);
      
      // Update bio with the uploaded image URL
      if (bioId && imageUrl) {
        await updateBio(bioId, { imageURL: imageUrl });
        showToast('Profile image updated successfully', 'success');
      } else if (bioId && !imageUrl) {
        // Remove image
        await updateBio(bioId, { imageURL: '' });
        showToast('Profile image removed successfully', 'success');
      }
    } catch (error) {
      showToast('Failed to update profile image', 'error');
      // Revert state on error - reload from API
      if (bioId) {
        try {
          const currentUser = await getCurrentUser();
          if (currentUser?.bio?.imageURL) setProfileImage(currentUser.bio.imageURL);
        } catch {}
      }
    }
  }, [bioId, updateBio, uploadFile, getCurrentUser, showToast]);

  const handleFontChange = useCallback(async (font: string) => {
    setSelectedFont(font);
    if (bioId) {
      try {
        await updateBio(bioId, { pageFont: font });
      } catch (error) {
      }
    }
  }, [bioId, updateBio]);

  const handleTextColorChange = useCallback(async (color: string) => {
    setSelectedTextColor(color);
    if (bioId) {
      try {
        await updateBio(bioId, { textColor: color });
        showToast('Text color updated successfully', 'success');
      } catch (error) {
        showToast('Failed to update text color', 'error');
      }
    }
  }, [bioId, updateBio, showToast]);

  const handleLayoutChange = useCallback(async (layout: PageLayout) => {
    setSelectedLayout(layout);
    if (bioId) {
      try {
        // Map PageLayout to API format: layout1 -> vertical, layout2 -> horizontal
        const apiLayout = layout === 'layout1' ? 'vertical' : 'horizontal';
        await updateBio(bioId, { layoutForAvatarAndBio: apiLayout });
        showToast('Layout updated successfully', 'success');
      } catch (error) {
        showToast('Failed to update layout', 'error');
      }
    }
  }, [bioId, updateBio, showToast]);

  const handleBackgroundColorChange = useCallback(async (color: string) => {
    setBackgroundColor(color);
    if (bioId) {
      try {
        await updateBio(bioId, { backgroundColor: color });
        showToast('Background color updated successfully', 'success');
      } catch (error) {
        showToast('Failed to update background color', 'error');
      }
    }
  }, [bioId, updateBio, showToast]);

  const handleBackgroundImageChange = useCallback(async (fileOrUrl: File | string) => {
    try {
      let imageUrl: string;
      
      // If it's a File object, upload it first
      if (fileOrUrl instanceof File) {
        const uploadResponse = await uploadFile(fileOrUrl);
        if (!uploadResponse?.imageURL) {
          throw new Error('Failed to upload background image');
        }
        imageUrl = uploadResponse.imageURL;
      } else {
        // If it's already a URL string (for removal, pass empty string)
        imageUrl = fileOrUrl;
      }
      
      // Update state optimistically
      setBackgroundImage(imageUrl);
      
      // Update bio with the uploaded image URL
      if (bioId && imageUrl) {
        await updateBio(bioId, { backgroundImageURL: imageUrl });
        showToast('Background image updated successfully', 'success');
      } else if (bioId && !imageUrl) {
        // Remove image
        await updateBio(bioId, { backgroundImageURL: '' });
        showToast('Background image removed successfully', 'success');
      }
    } catch (error) {
      showToast('Failed to update background image', 'error');
      // Revert state on error - reload from API
      if (bioId) {
        try {
          const currentUser = await getCurrentUser();
          if (currentUser?.bio?.backgroundImageURL) setBackgroundImage(currentUser.bio.backgroundImageURL);
        } catch {}
      }
    }
  }, [bioId, updateBio, uploadFile, getCurrentUser, showToast]);

  // Transform social links for MobilePreview component
  const transformedSocialLinks = socialLinks.map(({ id, ...link }) => ({
    ...link,
    icon: link.icon || getSocialIcon(link.platform, 16, '#FFFFFF'),
  }));

  // Show full-screen loader ONLY on initial page load.
  // Do not block UI for background refetches (e.g., after updates) because that causes loader flashes.
  if (isLoadingData) {
    return <Loader fullScreen={true} />;
  }

  return (
    <PageContainer>
      <ContentContainer>
        <LeftPanel>
          <LeftPanelContent>
            <ProfileSection
              pageUrl={pageUrl}
              coverImage={coverImage}
              profileImage={profileImage}
              pageName={pageName}
              introMessage={introMessage}
              selectedFont={selectedFont}
              selectedTextColor={selectedTextColor}
              selectedLayout={selectedLayout}
              backgroundColor={backgroundColor}
              backgroundImage={backgroundImage}
              onPageUrlChange={handlePageUrlChange}
              onCoverImageChange={handleCoverImageChange}
              onProfileImageChange={handleProfileImageChange}
              onPageNameChange={handlePageNameChange}
              onIntroMessageChange={handleIntroMessageChange}
              onFontChange={handleFontChange}
              onTextColorChange={handleTextColorChange}
              onLayoutChange={handleLayoutChange}
              onBackgroundColorChange={handleBackgroundColorChange}
              onBackgroundImageChange={handleBackgroundImageChange}
            />

            <SocialLinksSection 
              links={socialLinks} 
              onReorder={handleReorderSocialLinks}
              onAddLink={handleAddSocialLink}
              onRemoveLink={handleRemoveSocialLink}
              onUpdateLink={handleUpdateSocialLink}
            />

            <CustomButtonsSection
              buttons={customButtons}
              onAddButton={handleAddCustomButton}
              onUpdateButton={handleUpdateCustomButton}
              onDeleteButton={handleDeleteCustomButton}
              onReorder={handleReorderCustomButtons}
              onToggleActive={handleToggleCustomButtonActive}
            />

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSectionDragEnd} id="sections-dnd">
              <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
                {sectionOrder.map((sectionId) => {
                  if (sectionId === 'custom-sections-embeds') {
                    return (
                      <SortableCustomSectionsEmbedsSection
                        key={sectionId}
                        coverImage={coverImage}
                        contentItems={contentItems}
                        customSections={customSections}
                        customSectionsOrder={customSectionsOrder}
                        textSections={textSections}
                        onAddContent={handleAddContent}
                        onUpdateContent={handleUpdateContent}
                        onDeleteContent={handleDeleteContent}
                        onAddCustomSection={handleAddCustomSection}
                        onUpdateCustomSection={handleUpdateCustomSection}
                        onDeleteCustomSection={handleDeleteCustomSection}
                        onAddContentToCustomSection={handleAddContentToCustomSection}
                        onUpdateContentInCustomSection={handleUpdateContentInCustomSection}
                        onDeleteContentFromCustomSection={handleDeleteContentFromCustomSection}
                        onReorderItemsInCustomSection={handleReorderItemsInCustomSection}
                        onReorderSections={handleReorderSectionsInCustomSectionsEmbeds}
                        onAddEmbedSection={handleAddEmbedSection}
                        onAddEmailSection={handleAddEmailSection}
                        onUpdateEmailSection={handleUpdateEmailSection}
                        onDeleteEmailSection={handleDeleteEmailSection}
                        onAddTextSection={handleAddTextSection}
                        onUpdateTextSection={handleUpdateTextSection}
                        onDeleteTextSection={handleDeleteTextSection}
                        onReorderTextSections={handleReorderTextSections}
                      />
                    );
                  }
                  if (sectionId === 'engagements') {
                    // Only show engagements section if brandKitItems has data
                    if (brandKitItems.length === 0) {
                      return null;
                    }
                    return (
                      <EngagementsSection
                        key={sectionId}
                        engagements={engagements}
                        onAddEngagement={handleAddEngagement}
                        onUpdateEngagement={handleUpdateEngagement}
                        onDeleteEngagement={handleDeleteEngagement}
                        onReorderEngagements={handleReorderEngagements}
                      />
                    );
                  }
                  if (sectionId === 'pricing-packages') {
                    // Only show pricing packages section if brandKitItems has data
                    if (brandKitItems.length === 0) {
                      return null;
                    }
                    return (
                      <PricingPackagesSection
                        key={sectionId}
                        pricing={pricing}
                        onAddPricing={handleAddPricing}
                        onUpdatePricing={handleUpdatePricing}
                        onDeletePricing={handleDeletePricing}
                        onReorderPricing={handleReorderPricing}
                      />
                    );
                  }
                  if (sectionId === 'brand-kit') {
                    return (
                      <SortableBrandKitSection
                        key={sectionId}
                        brandKitItems={brandKitItems}
                        onAddBrandKit={handleAddBrandKit}
                        onUpdateBrandKit={handleUpdateBrandKit}
                        onDeleteBrandKit={handleDeleteBrandKit}
                        onReorderBrandKit={handleReorderBrandKit}
                      />
                    );
                  }
                  return null;
                })}
              </SortableContext>
            </DndContext>
          </LeftPanelContent>
        </LeftPanel>

        <RightPanel>
          <MobilePreview
            pageName={pageName}
            coverImage={coverImage}
            profileImage={profileImage}
            introMessage={introMessage}
            socialLinks={transformedSocialLinks}
            backgroundColor={backgroundColor}
            backgroundImage={backgroundImage}
            selectedFont={selectedFont}
            selectedTextColor={selectedTextColor}
            selectedLayout={selectedLayout}
            contentItems={contentItems}
            customSections={customSections}
            textSections={textSections}
            brandKitItems={brandKitItems}
            engagements={engagements}
            pricing={pricing}
            customButtons={customButtons}
          />
        </RightPanel>
      </ContentContainer>
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
        position="top-center"
      />
    </PageContainer>
  );
}

