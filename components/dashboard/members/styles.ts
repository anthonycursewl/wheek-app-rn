import { StyleSheet } from 'react-native';
import { colors } from 'shared/constants/manager-store';

export const dashboardStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    header: {
        backgroundColor: colors.white,
        padding: 16,
        paddingTop: 50,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: 16,
        color: colors.dark,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        gap: 8,
        backgroundColor: colors.white,
    },
    activeTab: {
        backgroundColor: colors.primary,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.primary,
    },
    activeTabText: {
        color: colors.white,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    section: {
        marginTop: 24,
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.dark,
    },
    addButton: {
        backgroundColor: colors.primary,
        borderRadius: 100,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingContainer: {
        paddingVertical: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: colors.gray,
    },
    emptyContainer: {
        paddingVertical: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        marginTop: 12,
        fontSize: 16,
        color: colors.dark,
        fontWeight: '500',
    },
    emptySubtext: {
        marginTop: 4,
        fontSize: 14,
        color: colors.gray,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginTop: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    retryButtonText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '500',
    },
    separator: {
        height: 12,
    },
    footerLoading: {
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    footerLoadingText: {
        fontSize: 14,
        color: colors.gray,
    },
});

export default dashboardStyles;
