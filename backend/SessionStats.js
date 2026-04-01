class SessionStats {
    constructor() {
        this.totalSearches = 0;
        this.cacheHits = 0;
        this.cacheMisses = 0;
        this.evictions = 0;
    }

    recordHit() {
        this.totalSearches++;
        this.cacheHits++;
    }

    recordMiss() {
        this.totalSearches++;
        this.cacheMisses++;
    }

    recordEviction() {
        this.evictions++;
    }

    getStats() {
        const hitPer = this.totalSearches === 0 ? 0 : (this.cacheHits * 100) / this.totalSearches;
        const missPer = this.totalSearches === 0 ? 0 : (this.cacheMisses * 100) / this.totalSearches;

        return {
            totalSearches: this.totalSearches,
            cacheHits: this.cacheHits,
            cacheMisses: this.cacheMisses,
            evictions: this.evictions,
            hitPercentage: hitPer.toFixed(1),
            missPercentage: missPer.toFixed(1)
        };
    }

    reset() {
        this.totalSearches = 0;
        this.cacheHits = 0;
        this.cacheMisses = 0;
        this.evictions = 0;
    }
}

module.exports = SessionStats;
