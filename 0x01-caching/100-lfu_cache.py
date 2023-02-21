#!/usr/bin/env python3
"""
Learning Caching
"""

from base_caching import BaseCaching


class LFUCache(BaseCaching):
    """
    LFU Caching System
    """
    def __init__(self):
        """
        Initializing the caching system
        """
        super().__init__()
        self.lfu_data = {}

    def put(self, key, item):
        """
        Add an item to the cache
        """
        if key is not None and item is not None:
            if key not in self.cache_data:
                if len(self.cache_data) == BaseCaching.MAX_ITEMS:
                    lowest_frequency = min(self.lfu_data.values())
                    for k, v in self.lfu_data.items():
                        if v == lowest_frequency:
                            break
                    del self.cache_data[k]
                    del self.lfu_data[k]
                    print("DISCARD: {}".format(k))
                self.lfu_data[key] = 1
            else:
                del self.cache_data[key]
                self.lfu_data[key] += 1

            self.cache_data[key] = item

    def get(self, key):
        """
        Get an item by key
        """
        if key is None or key not in self.cache_data:
            return None
        item = self.cache_data[key]
        del self.cache_data[key]
        self.cache_data[key] = item
        self.lfu_data[key] += 1
        return self.cache_data[key]
